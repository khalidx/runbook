import Handlebars from 'handlebars'

export const handlebars = {
  /** Use the created template like `console.log(template({ greeting: "Hello!" }))` */
  template: (text: string) => Handlebars.compile(text),
  /** Get the names of the arguments in the template string */
  args (text: string) {
    const names: Array<string> = []
    function MyCompiler() {
      // @ts-expect-error
      Handlebars.JavaScriptCompiler.apply(this, arguments)
    }
    // @ts-expect-error
    MyCompiler.prototype = new Handlebars.JavaScriptCompiler()
    MyCompiler.prototype.compiler = MyCompiler
    // @ts-expect-error
    MyCompiler.prototype.nameLookup = function(parent, name, type) {
      if (type === 'context') names.push(name)
      // @ts-expect-error
      return Handlebars.JavaScriptCompiler.prototype.nameLookup.call(this, parent, name, type)
    }
    const env = Handlebars.create()
    // @ts-expect-error
    env.JavaScriptCompiler = MyCompiler
    const template = env.compile(text)
    template({}) // providing no values to template. running just to run the compiler to extract names.
    return names
  }
}

export default handlebars
