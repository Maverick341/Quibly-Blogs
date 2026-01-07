import "./index.css";

/**
 * CodeTool for Editor.js
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */

/* global PasteEvent */

/**
 * Code Tool for the Editor.js allows to include code examples in your articles.
 */
export default class CodeTool {
  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @typedef {object} CodeData — plugin saved data
   * @property {string} code - previously saved plugin code
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - tool constricting options
   * @param {CodeData} options.data — previously saved plugin code
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.placeholder = this.api.i18n.t(
      config.placeholder || CodeTool.DEFAULT_PLACEHOLDER
    );

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: "ce-code",
      textarea: "ce-code__textarea",
      select: "ce-code__languagecode",
    };

    this.languageList = [
      // { name: "Select Language", code: "" },
      { name: "HTML", code: "html" },
      { name: "CSS", code: "css" },
      { name: "JavaScript", code: "js" },
      { name: "ABAP", code: "abap" },
      { name: "Augmented Backus-Naur form", code: "abnf" },
      { name: "ActionScript", code: "actionscript" },
      { name: "Ada", code: "ada" },
      { name: "AL", code: "al" },
      { name: "ANTLR4", code: "antlr4" },
      { name: "Apache Configuration", code: "apacheconf" },
      { name: "APL", code: "apl" },
      { name: "AppleScript", code: "applescript" },
      { name: "AQL", code: "aql" },
      { name: "Arduino", code: "arduino" },
      { name: "ARFF", code: "arff" },
      { name: "AsciiDoc", code: "asciidoc" },
      { name: "6502 Assembly", code: "asm6502" },
      { name: "ASP.NET (C#)", code: "aspnet" },
      { name: "AutoHotkey", code: "autohotkey" },
      { name: "AutoIt", code: "autoit" },
      { name: "Bash", code: "bash" },
      { name: "BASIC", code: "basic" },
      { name: "Batch", code: "batch" },
      { name: "BBcode", code: "bbcode" },
      { name: "Bison", code: "bison" },
      { name: "Backus–Naur form", code: "bnf" },
      { name: "Brainfuck", code: "brainfuck" },
      { name: "BrightScript", code: "brightscript" },
      { name: "Bro", code: "bro" },
      { name: "C", code: "c" },
      { name: "Concurnas", code: "concurnas" },
      { name: "C#", code: "csharp" },
      { name: "C++", code: "cpp" },
      { name: "CIL", code: "cil" },
      { name: "CoffeeScript", code: "coffeescript" },
      { name: "CMake", code: "cmake" },
      { name: "Clojure", code: "clojure" },
      { name: "Crystal", code: "crystal" },
      { name: "Content-Security-Policy", code: "csp" },
      { name: "CSS Extras", code: "css-extras" },
      { name: "D", code: "d" },
      { name: "Dart", code: "dart" },
      { name: "DAX", code: "dax" },
      { name: "Diff", code: "diff" },
      { name: "DNS zone file", code: "dns-zone-file" },
      { name: "Docker", code: "docker" },
      { name: "Extended Backus–Naur form", code: "ebnf" },
      { name: "Eiffel", code: "eiffel" },
      { name: "EJS", code: "ejs" },
      { name: "Elixir", code: "elixir" },
      { name: "Elm", code: "elm" },
      { name: "Embedded Lua templating", code: "etlua" },
      { name: "ERB", code: "erb" },
      { name: "Erlang", code: "erlang" },
      { name: "Excel Formula", code: "xlsx" },
      { name: "F#", code: "fsharp" },
      { name: "Factor", code: "factor" },
      { name: "Firestore security rules", code: "firestore-security-rules" },
      { name: "Flow", code: "flow" },
      { name: "Fortran", code: "fortran" },
      { name: "FreeMarker Template Language", code: "ftl" },
      { name: "G-code", code: "gcode" },
      { name: "GDScript", code: "gdscript" },
      { name: "GEDCOM", code: "gedcom" },
      { name: "Gherkin", code: "gherkin" },
      { name: "Git", code: "git" },
      { name: "GLSL", code: "glsl" },
      { name: "GameMaker Language", code: "gml" },
      { name: "Go", code: "go" },
      { name: "GraphQL", code: "graphql" },
      { name: "Groovy", code: "groovy" },
      { name: "Haml", code: "haml" },
      { name: "Handlebars", code: "handlebars" },
      { name: "Haskell", code: "haskell" },
      { name: "Haxe", code: "haxe" },
      { name: "HCL", code: "hcl" },
      { name: "HLSL", code: "hlsl" },
      { name: "HTTP", code: "http" },
      { name: "HTTP Public-Key-Pins", code: "hpkp" },
      { name: "HTTP Strict-Transport-Security", code: "hsts" },
      { name: "IchigoJam", code: "ichigojam" },
      { name: "Icon", code: "icon" },
      { name: "Structured Text (IEC 61131-3)", code: "iecst" },
      { name: "Inform 7", code: "inform7" },
      { name: "Ini", code: "ini" },
      { name: "Io", code: "io" },
      { name: "J", code: "j" },
      { name: "Java", code: "java" },
      { name: "JavaDoc", code: "javadoc" },
      { name: "JavaDoc-like", code: "javadoclike" },
      { name: "Java stack trace", code: "javastacktrace" },
      { name: "Jinja2", code: "jinja2" },
      { name: "Jolie", code: "jolie" },
      { name: "JQ", code: "jq" },
      { name: "JSDoc", code: "jsdoc" },
      { name: "JS Extras", code: "js-extras" },
      { name: "JS Templates", code: "js-templates" },
      { name: "JSON", code: "json" },
      { name: "JSONP", code: "jsonp" },
      { name: "JSON5", code: "json5" },
      { name: "Julia", code: "julia" },
      { name: "Keyman", code: "keyman" },
      { name: "Kotlin", code: "kotlin" },
      { name: "LaTeX", code: "latex" },
      { name: "Latte", code: "latte" },
      { name: "Less", code: "less" },
      { name: "LilyPond", code: "lilypond" },
      { name: "Liquid", code: "liquid" },
      { name: "Lisp", code: "lisp" },
      { name: "LiveScript", code: "livescript" },
      { name: "LLVM IR", code: "llvm" },
      { name: "LOLCODE", code: "lolcode" },
      { name: "Lua", code: "lua" },
      { name: "Makefile", code: "makefile" },
      { name: "Markdown", code: "markdown" },
      { name: "Markup templating", code: "markup-templating" },
      { name: "MATLAB", code: "matlab" },
      { name: "MEL", code: "mel" },
      { name: "Mizar", code: "mizar" },
      { name: "Monkey", code: "monkey" },
      { name: "MoonScript", code: "moonscript" },
      { name: "N1QL", code: "n1ql" },
      { name: "N4JS", code: "n4js" },
      { name: "Nand To Tetris HDL", code: "nand2tetris-hdl" },
      { name: "NASM", code: "nasm" },
      { name: "NEON", code: "neon" },
      { name: "nginx", code: "nginx" },
      { name: "Nim", code: "nim" },
      { name: "Nix", code: "nix" },
      { name: "NSIS", code: "nsis" },
      { name: "Objective-C", code: "objectivec" },
      { name: "OCaml", code: "ocaml" },
      { name: "OpenCL", code: "opencl" },
      { name: "Oz", code: "oz" },
      { name: "PARI/GP", code: "parigp" },
      { name: "Parser", code: "parser" },
      { name: "Pascal", code: "pascal" },
      { name: "Pascaligo", code: "pascaligo" },
      { name: "PC-Axis", code: "pcaxis" },
      { name: "PeopleCode", code: "peoplecode" },
      { name: "Perl", code: "perl" },
      { name: "PHP", code: "php" },
      { name: "PHPDoc", code: "phpdoc" },
      { name: "PHP Extras", code: "php-extras" },
      { name: "PL/SQL", code: "plsql" },
      { name: "PowerQuery", code: "powerquery" },
      { name: "PowerShell", code: "powershell" },
      { name: "Processing", code: "processing" },
      { name: "Prolog", code: "prolog" },
      { name: ".properties", code: "properties" },
      { name: "Protocol Buffers", code: "protobuf" },
      { name: "Pug", code: "pug" },
      { name: "Puppet", code: "puppet" },
      { name: "Pure", code: "pure" },
      { name: "PureBasic", code: "purebasic" },
      { name: "Python", code: "python" },
      { name: "Q (kdb+ database)", code: "q" },
      { name: "QML", code: "qml" },
      { name: "Qore", code: "qore" },
      { name: "R", code: "r" },
      { name: "Racket", code: "racket" },
      { name: "React JSX", code: "jsx" },
      { name: "React TSX", code: "tsx" },
      { name: "Ren'py", code: "renpy" },
      { name: "Reason", code: "reason" },
      { name: "Regex", code: "regex" },
      { name: "reST (reStructuredText)", code: "rest" },
      { name: "Rip", code: "rip" },
      { name: "Roboconf", code: "roboconf" },
      { name: "Robot Framework", code: "robotframework" },
      { name: "Ruby", code: "ruby" },
      { name: "Rust", code: "rust" },
      { name: "SAS", code: "sas" },
      { name: "Sass (Sass)", code: "sass" },
      { name: "Sass (Scss)", code: "scss" },
      { name: "Scala", code: "scala" },
      { name: "Scheme", code: "scheme" },
      { name: "Shell session", code: "shell-session" },
      { name: "Smalltalk", code: "smalltalk" },
      { name: "Smarty", code: "smarty" },
      { name: "Solidity (Ethereum)", code: "solidity" },
      { name: "Solution file", code: "solution-file" },
      { name: "Soy (Closure Template)", code: "soy" },
      { name: "SPARQL", code: "sparql" },
      { name: "Splunk SPL", code: "splunk-spl" },
      { name: "SQF: Status Quo Function (Arma 3)", code: "sqf" },
      { name: "SQL", code: "sql" },
      { name: "Stylus", code: "stylus" },
      { name: "Swift", code: "swift" },
      { name: "TAP", code: "tap" },
      { name: "Tcl", code: "tcl" },
      { name: "Textile", code: "textile" },
      { name: "TOML", code: "toml" },
      { name: "Template Toolkit 2", code: "tt2" },
      { name: "Turtle", code: "turtle" },
      { name: "Twig", code: "twig" },
      { name: "TypeScript", code: "typescript" },
      { name: "T4 Text Templates (C#)", code: "t4-cs" },
      { name: "T4 Text Templates (VB)", code: "t4-vb" },
      { name: "T4 templating", code: "t4-templating" },
      { name: "UnrealScript", code: "unrealscript" },
      { name: "Vala", code: "vala" },
      { name: "VB.Net", code: "vbnet" },
      { name: "Velocity", code: "velocity" },
      { name: "Verilog", code: "verilog" },
      { name: "VHDL", code: "vhdl" },
      { name: "vim", code: "vim" },
      { name: "Visual Basic", code: "visual-basic" },
      { name: "WarpScript", code: "warpscript" },
      { name: "WebAssembly", code: "wasm" },
      { name: "Wiki markup", code: "wiki" },
      { name: "Xeora", code: "xeora" },
      { name: "XML doc (.net)", code: "xml-doc" },
      { name: "Xojo (REALbasic)", code: "xojo" },
      { name: "XQuery", code: "xquery" },
      { name: "YAML", code: "yaml" },
      { name: "Zig", code: "zig" },
    ];

    this.nodes = {
      holder: null,
      textarea: null,
      picker: null,
    };

    this.data = {
      code: data.code || "",
      languageCode: data.languageCode || "python", // change to empty string "" later
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    let wrapper = document.createElement("div"),
      headerBar = document.createElement("div"),
      textarea = document.createElement("pre"),
      picker = document.createElement("select"),
      actionsContainer = document.createElement("div"),
      copyButton = document.createElement("button"),
      deleteButton = document.createElement("button");

    // Create language options
    for (const language of this.languageList) {
      let option = document.createElement("option");
      option.text = language.name;
      option.value = language.code;
      picker.appendChild(option);
    }

    // Add classes
    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    headerBar.classList.add("ce-code__header");
    picker.classList.add(this.CSS.select);
    textarea.contentEditable = true;
    textarea.spellcheck = false;
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    actionsContainer.classList.add("ce-code__actions");
    copyButton.classList.add("ce-code__button");
    deleteButton.classList.add("ce-code__button");

    // Set content
    textarea.textContent = this.data.code;
    picker.value = this.data.languageCode;
    textarea.placeholder = this.placeholder;

    // Add copy icon (SVG)
    copyButton.type = "button";
    copyButton.innerHTML = `<svg fill="none" viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M9.3 3.8a.5.5 0 0 0 1 0h-1Zm-5.5 6.5a.5.5 0 0 0 0-1v1Zm3.6-3.6h5.4v-1H7.4v1Zm6.1.7v5.4h1V7.4h-1Zm-.7 6.1H7.4v1h5.4v-1Zm-6.1-.7V7.4h-1v5.4h1ZM3.2 2.5h5.4v-1H3.2v1Zm-.7 6.1V3.2h-1v5.4h1Zm6.8-5.4v.6h1v-.6h-1ZM3.8 9.3h-.6v1h.6v-1Zm-2.3-.7a1.7 1.7 0 0 0 1.7 1.7v-1a.7.7 0 0 1-.7-.7h-1Zm7.1-6.1a.7.7 0 0 1 .7.7h1a1.7 1.7 0 0 0-1.7-1.7v1Zm-5.4-1a1.7 1.7 0 0 0-1.7 1.7h1a.7.7 0 0 1 .7-.7v-1Zm4.2 12a.7.7 0 0 1-.7-.7h-1a1.7 1.7 0 0 0 1.7 1.7v-1Zm6.1-.7a.7.7 0 0 1-.7.7v1a1.7 1.7 0 0 0 1.7-1.7h-1Zm-.7-6.1a.7.7 0 0 1 .7.7h1a1.7 1.7 0 0 0-1.7-1.7v1Zm-5.4-1a1.7 1.7 0 0 0-1.7 1.7h1a.7.7 0 0 1 .7-.7v-1Z"></path></svg>`;
    copyButton.dataset.tooltip = "Copy code";
    copyButton.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(textarea.textContent);
        copyButton.dataset.tooltip = "Copied!";
        setTimeout(() => {
          copyButton.dataset.tooltip = "Copy code";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });

    // Add delete icon (SVG)
    deleteButton.type = "button";
    deleteButton.innerHTML = `<svg fill="none" viewBox="0 0 16 16" width="12" height="12"><path stroke="currentColor" stroke-width="1.25" d="m3.2 3.467.49 8.318a2 2 0 0 0 1.997 1.882h4.629a2 2 0 0 0 1.996-1.883l.488-8.317m-9.6 0H2m1.2 0h2.402m7.198 0H14m-1.2 0h-2.4m-4.798 0 .369-1.115a1 1 0 0 1 .949-.685h2.159a1 1 0 0 1 .948.683l.373 1.117m-4.798 0H10.4m-3.6 3v4.2m2.4-4.2v4.2" stroke-linecap="round"></path></svg>`;
    deleteButton.dataset.tooltip = "Delete";
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._deleteCurrentBlock();
    });

    // Assemble the structure
    actionsContainer.appendChild(copyButton);
    actionsContainer.appendChild(deleteButton);
    headerBar.appendChild(picker);
    headerBar.appendChild(actionsContainer);
    wrapper.appendChild(headerBar);
    wrapper.appendChild(textarea);

    this.nodes.textarea = textarea;
    this.nodes.picker = picker;

    return wrapper;
  }

  _deleteCurrentBlock() {
    const currentIndex = this.api.blocks.getCurrentBlockIndex(); // Get the index of the currently focused block

    this.api.blocks.delete(currentIndex); // Delete the block by its index
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.nodes.holder - Code's wrapper
   * @public
   */
  render() {
    return this.nodes.holder;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} codeWrapper - CodeTool's wrapper, containing textarea with code
   * @returns {CodeData} - saved plugin code
   * @public
   */
  save(codeWrapper) {
    return {
      code: codeWrapper.querySelector("[contenteditable]").textContent,
      languageCode: codeWrapper.querySelector("select").value,
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;

    this.data = {
      code: content.textContent,
    };
  }

  /**
   * Returns Tool`s data from private property
   *
   * @returns {CodeData}
   */
  get data() {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   *
   * @param {CodeData} data - saved tool data
   */
  set data(data) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }

    if (this.nodes.picker) {
      this.nodes.picker.value = data.languageCode;
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17C7 17 7 15.2536 7 13.5L5.5 12L7 10.5C7 8.74644 7 7 9 7"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17C17 17 17 15.2536 17 13.5L18.5 12L17 10.5C17 8.74644 17 7 15 7"/></svg>`,
      title: "Code",
    };
  }

  /**
   * Default placeholder for CodeTool's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return "Write or Paste Code here";
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle CODE tag.
   *
   * @static
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["pre"],
    };
  }

  /**
   * Automatic sanitize config
   *
   * @returns {{code: boolean}}
   */
  static get sanitize() {
    return {
      code: true, // Allow HTML tags
    };
  }
}
