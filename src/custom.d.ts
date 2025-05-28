// custom.d.ts 
//This file helps TypeScript understand that any .module.css file, when imported, will return an object containing class names as strings
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}