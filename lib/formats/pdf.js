var Document = require('pdfkit');

function format(info, req, res) {
  res.set('content-type', 'application.pdf');

  var pdf = new Document(); 
  pdf.fontSize(28);
  pdf.text(info.doc.quote, {align: 'center'});
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
