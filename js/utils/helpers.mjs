const pageEl = document.querySelector('.page-a');
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const fonts = []; // "Roboto", "Caveat", "serif"

function addFontFromFile(files) {
  // const fileObj = files[0];
  for (let index = 0; index < files.length; index++) {
    const unfile = files[index];
    const reader = new FileReader();
    reader.onload = (e) => {
      const nombreFont = 'temp-font' + index;
      const newFont = new FontFace(nombreFont, e.target.result);
      newFont.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        fonts[fonts.length] = nombreFont;
        pageEl.style.fontFamily = nombreFont;
      });
    };
    reader.readAsArrayBuffer(unfile);
  }
}

/**
 * @method createPDF
 * @param imgs array of images (in base64)
 * @description
 * Creates PDF from list of given images
 */
function createPDF(imgs) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('p', 'pt', 'a4');
  const width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;
  for (const i in imgs) {
    doc.text(10, 20, '');
    doc.addImage(
      imgs[i],
      'JPEG',
      25,
      50,
      width - 50,
      height - 80,
      'image-' + i
    );
    if (i != imgs.length - 1) {
      doc.addPage();
    }
  }
  doc.save();
}

function formatText(event) {
  event.preventDefault();
  const text = event.clipboardData
    .getData('text/plain')
    .replace(/\n/g, '<br/>');
  // const untext = "<span style=\"color:red;font-family: math; \">"+text+"</span>";
  let nuevoTexto = text;
  if (fonts.length > 0) {
    nuevoTexto = '';
    let font_index = 0;
    for (let index = 0; index < text.length; index++) {
      font_index = parseInt(Math.random() * fonts.length);
      nuevoTexto +=
        '<span style="font-family: ' +
        fonts[font_index] +
        '; ">' +
        text.charAt(index) +
        '</span>';
    }
  }
  document.execCommand('insertHTML', false, nuevoTexto);
}

function addPaperFromFile(file) {
  const tmppath = URL.createObjectURL(file);
  pageEl.style.backgroundImage = `url(${tmppath})`;
}

export { isMobile, addFontFromFile, createPDF, formatText, addPaperFromFile };
