import imageToBase64 from "image-to-base64";
import PdfPrinter from "pdfmake";

export const getPDFReadableStream = async (postsArray) => {
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
    content: postsArray.map((post) => {
      return [
        { text: post.author.name, style: "header", margin: [0, 15, 0, 0] },
        { text: post.title, style: "subheader", margin: [0, 2] },
        { text: post.category, style: "quote", margin: [0, 2] },
        post.content,
        { image: "postImage", width: 150, height: 150 },
      ];
    }),

    images: {
      postImage: await createBase64Img(
        "https://res.cloudinary.com/dp2c7c7ji/image/upload/v1673350955/cld-sample.jpg"
      ),
    },
    styles: {
      header: {
        fontSize: 15,
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
