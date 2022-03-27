import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';
import pug from 'pug';
import rimraf from 'rimraf';
import yaml from 'yaml';
import changeCase from 'change-case';
import matter from 'gray-matter';
import * as marked from 'marked';
import stylus from 'stylus';
import { Feed } from 'feed';
import * as dotenv from 'dotenv';
import { exit } from 'process';

dotenv.config();

const DirectoryMap = generateDirectoryMap([
  'dist',
  'pages',
  'style',
  'static',
]);

const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default build;

if (require.main === module) {
  build();
  exit();
}

function build() {
  console.log('Building...');

  const feed = new Feed({
    title: 'Jonathan Dupré',
    description: 'Web Security Advisor and Educator.',
    id: 'https://jonathandupre.com/',
    link: 'https://jonathandupre.com/',
    language: 'en',
    // image: "https://jonathandupre.com/images/logo/logomark-dark-572.png",
    favicon: 'https://jonathandupre.com/favicon.ico',
    copyright: '© 2012-2022, Jonathan Dupré.',
    generator: 'None',
    feedLinks: {
      atom: 'https://jonathandupre.com/atom',
      rss: 'https://jonathandupre.com/rss',
    },
    author: {
      name: 'Jonathan Dupré',
      link: 'https://jonathandupre.com',
    },
  });

  recreateDist();
  copyAssets();
  buildCSS();

  const renderer = new marked.Renderer();
  const baseImgRenderingFn = renderer.image;

  const data: Record<string, any> = loadData();

  data.routes = {};

  const dynamicRoutes: Array<string> = [];
  const pages = listFilesRecursive(DirectoryMap.pages).filter((page) => {
    if (path.basename(page, '.pug')[0] === '_') {
      dynamicRoutes.push(page);

      return false;
    }

    return true;
  });

  const opts = {
    basedir: path.join(__dirname, '..'),
  };

  dynamicRoutes.forEach(generateRoute);
  pages.forEach((page) => generatePage(page));

  fs.writeFileSync('dist/rss', feed.rss2());
  fs.writeFileSync('dist/atom', feed.atom1());

  console.log('Done.');

  function generateRoute(route) {
    const dirName = path.dirname(route).split('/').slice(-1)[0];
    const contentDir = path.join(__dirname, '..', 'content', dirName);
    const filenames = fs.readdirSync(contentDir);
    const filepaths = filenames.map((filename) => path.join(contentDir, filename));

    if (!data.routes[dirName]) {
      data.routes[dirName] = [];
    }

    const folder = data.routes[dirName];

    filepaths.forEach((filepath) => {
      const str = fs.readFileSync(filepath, 'utf8');
      const dest = getDestination(filepath);
      const frontmatter = matter(str);
      const pageData = frontmatter.data;

      const item = {
        slug: path.basename(filepath, path.extname(filepath)),
        title: pageData.title,
        date: formatDate(pageData.date),
      };

      folder.push(item);

      renderer.image = generateImageRenderingFn();

      const content = marked.marked(frontmatter.content, { renderer });

      if (dirName === 'blog') {
        feed.addItem({
          ...item,
          content,
          date: new Date(item.date),
          link: `https://jonathandupre.com/blog/${item.slug}`,
        });
      }

      generatePage(route, dest, { post: { data: pageData, content } });
    });
  }

  function generateImageRenderingFn() {
    return function (href, title, text) {
      href = `${process.env.ASSET_URL || ''}/images/${href}`;

      return baseImgRenderingFn.call(renderer, href, title, text);
    };
  }

  function generatePage(src:string, dest?: string, locals = {}) {
    const file = fs.readFileSync(src, 'utf8');
    const html = compilePug(src, file, locals);

    if (!dest) {
      dest = getDestination(src);
    }

    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, html);
  }

  function compilePug(filename, file, locals) {
    return pug.compile(file, { ...opts, filename })(Object.assign(locals, data));
  }
}

function getDestination(src) {
  const d = path.relative(DirectoryMap.root, path.dirname(src));
  const subdir = d.replace('pages', '').replace('content', '');

  const dir = path.join(DirectoryMap.dist, subdir);
  const ext = path.extname(src);
  const filename = `${path.basename(src, ext)}.html`;
  const dest = path.join(dir, filename);

  return dest;
}

function getPageKey(filename) {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);

  return changeCase.camel(basename);
}

function listFilesRecursive(dir: string): Array<string> {
  const filenames = fs.readdirSync(dir);

  const files: (string | string[])[] = filenames.map((filename) => {
    const filepath = path.join(dir, filename);

    return fs.statSync(filepath).isDirectory()
      ? listFilesRecursive(filepath)
      : filepath;
  });

  return flatten(files);
}

function flatten(array): Array<string> {
  return [].concat(...array);
}

function loadData() {
  const dataDir = path.join(__dirname, '../data');

  const filenames = fs.readdirSync(dataDir);
  const data = {};

  filenames.forEach((filename) => {
    const name = getPageKey(filename);
    const file = fs.readFileSync(path.join(dataDir, filename), 'utf8');

    data[name] = yaml.parse(file);
  });

  return data;
}

function recreateDist() {
  rimraf.sync(DirectoryMap.dist);
  mkdirp.sync(DirectoryMap.dist);
}

function formatDate(value) {
  const d = new Date(value);

  return `${Months[d.getMonth()]} ${String(d.getDate())} ${d.getFullYear()}`;
}

function buildCSS() {
  const styleStr = fs.readFileSync(path.join(DirectoryMap.style, 'style.styl'), 'utf8');

  stylus.render(styleStr, { filename: 'style.css' }, function (err, css) {
    if (err) throw err;

    fs.writeFileSync(path.join(DirectoryMap.dist, 'style.css'), css);
  });
}

function copyAssets() {
  fse.copySync(DirectoryMap.static, DirectoryMap.dist);
}

function generateDirectoryMap(directories): Record<string, string> {
  const rootDir = path.join(__dirname, '..');
  const dir = { root: rootDir };

  directories.forEach((name) => {
    dir[name] = path.join(rootDir, name);
  });

  return dir;
}
