var Document = require('pdfkit');

/**
 *  Convert a quote to a PDF document.
 */
function format(info, req, res) {
  res.set('content-type', 'application/pdf');

  var pdf = new Document(); 
  pdf.font('www/public/assets/fonts/NotoSerif-Regular-webfont.ttf');
  pdf.fontSize(28);
  pdf.text('\u201C' + info.doc.quote + '\u201D', {align: 'center'});
  pdf.moveDown();
  pdf.fontSize(16);
  pdf.text('—', {continued: true})
  pdf.fillColor('blue');
  pdf.text(info.doc.author,
    {
      link: info.doc.link,
      continued: true
    }
  );

  pdf.pipe(res);
  pdf.end();
}

module.exports = format;
