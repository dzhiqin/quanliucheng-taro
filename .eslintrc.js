module.exports = {
  "extends": ["taro/react"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-shadow":["off", { "allow": ["resolve", "reject", "checkRes","resultEnum", "res"]}],
    "import/first": "off"
  }
}
