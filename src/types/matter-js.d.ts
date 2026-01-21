declare module 'matter-js' {
  namespace Matter {
    type Engine = any;
    type Body = any;
    type World = any;
    type Bodies = any;
    type Sleeping = any;
  }

  const Matter: {
    Engine: any;
    Body: any;
    World: any;
    Bodies: any;
    Sleeping: any;
  };

  export default Matter;
}
