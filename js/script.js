function start(xml) {
	const container = document.getElementById("codeContainer");

	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xml, "application/xml");
	const parseError = xmlDoc.getElementsByTagName("parsererror");

	if (parseError.length > 0) {
		container.innerHTML = `<p style="color: red;">Ошибка в XML: ${parseError[0].textContent}</p>`;
		return;
	}

	const trimmedXml = xml.trim();

	const highlightedCode = highlightXML(trimmedXml);

	const lines = highlightedCode.split("\n");

	container.innerHTML = lines
		.map(
			(line, index) => `
			<div class="line-wrapper">
				<div class="line-numbers">${index + 1}</div>
				<div class="code-line">${line || "&nbsp;"}</div>
			</div>`
		)
		.join("");
}

// Моковый XML
const mockXml = `
<CATALOG>
    <CD>
        <TITLE>Empire Burlesque</TITLE>
        <ARTIST>Bob Dylan</ARTIST>
        <COUNTRY>USA</COUNTRY>
        <COMPANY>Columbia</COMPANY>
        <PRICE>10.90</PRICE>
        <YEAR>1985</YEAR>
    </CD>
    <CD>
        <TITLE>Hide your heart</TITLE>
        <ARTIST>Bonnie Tyler</ARTIST>
        <COUNTRY>UK</COUNTRY>
        <COMPANY>CBS Records</COMPANY>
        <PRICE>9.90</PRICE>
        <YEAR>1988</YEAR>
    </CD>
</CATALOG>`;

// Вызов функции start
start(mockXml);
