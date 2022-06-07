namespace Chat {
  interface Response {
    version: "2.0";
    template: {
      outputs: Block[];
    };
  }

  type Block =
    | {
        simpleText: {
          text: string;
        };
      }
    | {
        simpleImage: {
          imageUrl: string;
          altText: string;
        };
      };
}
