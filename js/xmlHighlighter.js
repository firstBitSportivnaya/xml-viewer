/**
 * Подсветка синтаксиса для XML.
 * @param {string} xml - Строка XML для подсветки.
 * @returns {string} - Подсвеченный HTML-код.
 */
function highlightXML(xml) {
	const escapedXml = xml
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	return escapedXml.replace(
		/&lt;\/?([a-zA-Z0-9\-_.:]+)(\s+[a-zA-Z0-9\-_.:]+=".*?")*\s*\/?&gt;/g,
		(match, tagName, attributes) => {
			let result = `<span class="token tag">&lt;${tagName}</span>`;

			if (attributes) {
				result += attributes.replace(
					/([a-zA-Z0-9\-_.:]+)="(.*?)"/g,
					` <span class="token attr-name">$1</span>=<span class="token attr-value">"$2"</span>`
				);
			}

			result += `<span class="token tag">&gt;</span>`;
			return result;
		}
	);
}
