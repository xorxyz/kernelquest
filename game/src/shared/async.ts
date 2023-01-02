export function runSeries(arr: Array<(cb: () => void) => void>, callback = () => {}) {
  console.log(`runSeries: arr length left: ${arr.length}`);
  if (!arr.length) {
    callback();
    return;
  }

  const next = arr.shift() as (cb) => void;

  next(() => runSeries(arr, callback));
}
