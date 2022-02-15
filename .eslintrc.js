module.exports = {
  "extends": ["taro/react"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-shadow":["error", { "allow": ["resolve", "reject", "checkRes","resultEnum"]}],
    "import/first": "off"
  }
}
