import { Nonogram } from '../../modules/Nonogram.ts';
self.onmessage = async function (e) {
    const result = new Nonogram(e.data);
    postMessage(result);
};
