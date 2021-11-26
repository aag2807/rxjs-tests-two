import "./style.css";

import { from, fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  flatMap,
  map,
  mergeMap,
  pluck,
  reduce,
  takeLast,
} from "rxjs/operators";

function pigLatinify(word: string): string {
  if (word.length < 2) return word;
  return word.slice(1) + "-" + word[0].toLocaleLowerCase() + "ay";
}

const textbox = document.querySelector("#textbox")!;
const output = document.querySelector("textarea")!;

const keyup$ = fromEvent(textbox, "keyup");

keyup$
  .pipe(
    map((e: any) => e?.target?.value),
    mergeMap((wordstring) =>
      from(wordstring.split(/\s+/)).pipe(
        map((x: any) => pigLatinify(x)),
        reduce((bigString, newWord) => bigString + "" + newWord, "")
      )
    )
  )
  .subscribe((x) => {
    output.value = x;
  });

ajax("https://jsonplaceholder.typicode.com/posts")
  .pipe(
    pluck("response"),
    flatMap((x: any) => x),
    takeLast(2)
  )
  .subscribe(console.log);

const createThrottle = (delay: number) => {
  let timerId: number | undefined;
  return (func: (arg0?: any) => any | void) => {
    if (timerId) {
      return;
    }
    timerId = setTimeout(() => {
      func();
      timerId = undefined;
    }, delay);
  };
};

const secThrottle = createThrottle(1000);

secThrottle(() => console.log("hello"));

const createDebounce = (delay:number) => {
  let timerId: number | null;
  return (func:(arg0?:any) => any) => {
    timerId = setTimeout(func, delay);
  }
}

const minDebounce = createDebounce(1000);

minDebounce(() => console.log('hello world'))

