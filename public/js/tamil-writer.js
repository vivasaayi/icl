const _ = require("underscore");

class TamilWriter {
  constructor() {
    this._meys = {};
    this._uyirs = {};
    this._uyirMeys = {};

    this._initializeUyirs();
    this._initializeMeys();
    this._initializeUyirmeis();
  }

  _initializeUyirs() {
    this._meys["k"] = "க";
    this._meys["g"] = "க";
    this._meys["ng"] = "ங";
    this._meys["ch"] = "ச";
    this._meys["s"] = "ச";
    this._meys["gn"] = "ஞ";
    this._meys["t"] = "ட";
    this._meys["d"] = "ட";
    this._meys["N"] = "ண";
    this._meys["th"] = "த";
    this._meys["n"] = "ன";
    this._meys["nh"] = "ந";
    //ன
    this._meys["p"] = "ப";
    this._meys["m"] = "ம";
    this._meys["y"] = "ய";
    this._meys["r"] = "ர";
    this._meys["l"] = "ல";
    this._meys["v"] = "வ";
    this._meys["zh"] = "ழ";
    this._meys["L"] = "ள";
    this._meys["tr"] = "ற";
    this._meys["R"] = "ற";

    this._meys["S"] = "ஸ";
    this._meys["sh"] = "ஷ";
    this._meys["j"] = "ஜ";
  }

  _initializeMeys() {
    this._uyirs["a"] = "அ";
    this._uyirs["aa"] = "ஆ";
    this._uyirs["A"] = "ஆ";
    this._uyirs["i"] = "இ";
    this._uyirs["ee"] = "ஈ";
    this._uyirs["u"] = "உ";
    this._uyirs["U"] = "ஊ";
    this._uyirs["oo"] = "ஊ";
    this._uyirs["e"] = "எ";
    this._uyirs["ae"] = "ஏ";
    this._uyirs["I"] = "ஐ";
    this._uyirs["ai"] = "ஐ";
    this._uyirs["o"] = "ஒ";
    this._uyirs["O"] = "ஓ";
    this._uyirs["au"] = "ஔ";
  }

  _initializeUyirmeis() {
    this._uyirMeys["aa"] = "ா";
    this._uyirMeys["A"] = "ா";
    this._uyirMeys["i"] = "ி";
    this._uyirMeys["ee"] = "ீ";
    this._uyirMeys["u"] = "ு";
    this._uyirMeys["U"] = "ூ";
    this._uyirMeys["oo"] = "ூ";
    this._uyirMeys["e"] = "ெ";
    this._uyirMeys["ae"] = "ே";
    this._uyirMeys["I"] = "ை";
    this._uyirMeys["ai"] = "ை";
    this._uyirMeys["o"] = "ொ";
    this._uyirMeys["O"] = "ோ";
    this._uyirMeys["au"] = "ௌ";
  }

  test() {
    this.convert("amma");
    this.convert("Adu");
    this.convert("aadu");
    this.convert("ilai");
    this.convert("Isal");
    this.convert("eetti");
    this.convert("Ural");
    this.convert("oonjal");
    this.convert("erumai");
    this.convert("Eni");
    this.convert("Iyyar");
    this.convert("kalakkam");
    this.convert("santhosham");
  }

  _isAToken(str) {
    if (this._uyirs.hasOwnProperty(str) || this._meys.hasOwnProperty(str)) {
      return true;
    }

    return false;
  }

  convert(line) {
    this._buffer = "";
    var words = line.split(" ");

    _.each(words, word => {
      this.convertWord(word);
      this._buffer = this._buffer + " ";
    });

    this._buffer = this._buffer + "\n";
    return this._buffer;
  }

  convertWord(line) {
    var currentToken = "";

    var _tokens = [];

    _.each(line, currentChar => {
      var newToken = currentToken + currentChar;

      if (this._isAToken(newToken)) {
        currentToken = newToken;
      }
      else {
        _tokens.push(currentToken);
        currentToken = currentChar;
      }
    });

    _tokens.push(currentToken);

    var previousToken = "";
    for (var i = 0; i < _tokens.length; i++) {
      var token = _tokens[i];
      if (previousToken == "" && this._uyirs.hasOwnProperty(token)) {
        this._buffer = this._buffer + this._getUyir(token);
      }

      else if (previousToken == "" && this._meys.hasOwnProperty(token)) {
        previousToken = token;

        if (i == _tokens.length - 1) {
          this._buffer = this._buffer + (this._getMeys(token));
        }
      }

      else if (this._meys.hasOwnProperty(previousToken) && this._meys.hasOwnProperty(token)) {
        this._buffer = this._buffer + (this._getMeys(previousToken));
        previousToken = token;
      }

      else if (this._meys.hasOwnProperty(previousToken) && this._uyirs.hasOwnProperty(token)) {
        this._buffer = this._buffer + (this._getUyirMeys(previousToken, token));
        previousToken = "";
      }
      else {
        this._buffer = this._buffer + (token);
      }
    }
  }

  _getUyirMeys(previousToken, currentToken) {
    if (currentToken == "a")
      return this._meys[previousToken];
    return this._meys[previousToken] + this._uyirMeys[currentToken];
  }

  _getMeys(previousToken) {
    return this._meys[previousToken] + "்";
  }

  _getUyir(currentToken) {
    return this._uyirs[currentToken];
  }
}

var tamilWriter = new TamilWriter();
tamilWriter.test();

module.exports = TamilWriter;