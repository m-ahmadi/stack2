const presets = [
  [
    "@babel/env",
    {
      targets: {
				browsers: [
					"> 0.2%",
					"last 20 versions",
					"not dead"
				]
      },
      useBuiltIns: "usage",
			modules: "amd",
			loose: false
    },
  ],
];

const ignore = [
	"@*.js"
];
module.exports = { presets, ignore };