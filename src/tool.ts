export const Tool = {
  Eraser: 'eraser',
  Pen: 'pen',
} as const;
/*
type ToolObj = typeof Tool; //  { readonly Pen: 'pen'; readonly Eraser: 'eraser' };
// keyof は型に対して「そのプロパティ名すべて」を文字列リテラルのユニオン型として返す。
// Java の Map.keySet() を型の世界でやるもの。
type Keys = keyof ToolObj; // 'Pen' | 'Eraser'
// T[K]: インデックスアクセス型。キーに対応する値の型を取り出す。
type Tool = ToolObj[Keys]; // 'pen' | 'eraser'
// これを一行で書くと以下のようになる。
*/
export type Tool = (typeof Tool)[keyof typeof Tool];

// オブジェクトと型が同じ名前であるが、
// importは1つで済み、使う場所によって値か型かが自動で決まる。
// import { Tool } from './tool';
