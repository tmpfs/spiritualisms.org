var Document = require('pdfkit');

/**
 *  Convert a quote to a PDF document.
 */
function pdfdoc(info, cb) {
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

  pdf.end();

  cb(null, {stream: pdf});
}

module.exports = pdfdoc;
