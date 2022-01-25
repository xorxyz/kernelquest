#!/bin/sh

today=$(date "+%Y-%m-%d%n")
pages=$(find pages -type f | sed 's/pages\///g;s/.html//' | grep -v index)
wikis=$(find wiki -type f | sed 's/wiki\///g;s/.html//' | grep -v index)
posts=$(find posts -type f)

# interpreter="../../game/dist/interpreter.js"
# interpreter_dir=$(dirname "$interpreter")

# test -e "$interpreter" || (printf "'%s' not found\n" "$interpreter" && exit 1)

print_page() (
  dir="components"
  cat "$dir/head.html" "$dir/nav.html" "$2" "$dir/foot.html" \
  | sed -e "s/{{ PAGE_TITLE }}/$1/"\
        -e "s/{{ LAST_UPDATE }}/$today/"
)

cp -r assets/ public/ && \
cp -r js/*    public/ && \
# cp -r "$interpreter_dir"/* public/

for name in $pages; do
  print_page "| $name | " "pages/$name.html" > "public/$name.html"
done

for name in $wikis; do
  print_page "| $name | " "wiki/$name.html" > "public/$name.html"
done

for filepath in $posts; do
  filename=$(basename "$filepath")
  print_page "|" "$filepath" > "public/$filename"
done

print_page "|" "pages/index.html" > "public/index.html"
