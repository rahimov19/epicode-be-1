import imageToBase64 from "image-to-base64";
import PdfPrinter from "pdfmake";

export const getPDFReadableStream = async (blog) => {
  async function createBase64Img(url) {
    let base64Encoded = await imageToBase64(url);
    return "data:image/jpeg;base64, " + base64Encoded;
  }

  // Define font files
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica",
      italics: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: blog.author.name, style: "header", margin: [0, 15, 0, 0] },
      { text: blog.title, style: "subheader", margin: [0, 2] },
      { text: blog.category, style: "quote", margin: [0, 2] },
      blog.content,
      { image: "postImage", width: 200, height: 150, margin: [0, 10, 0, 0] },
    ],
    images: {
      postImage: await createBase64Img(blog.cover),
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        color: "#123123",
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
