module.exports = {
  preset: 'react-native',
  "reporters": [
  	"default",
  	["./node_modules/jest-html-reporter", {
  		"pageTitle": "Test Report"
  	}]
  ]
};
