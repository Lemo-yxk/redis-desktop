const { override, fixBabelImports } = require("customize-cra");

module.exports = override(
	fixBabelImports("import", {
		libraryName: "material",
		libraryDirectory: "es",
		style: "css"
	})
);
