import Provider from "@/api-provider";

const services = {
    settings: () => {
      return Provider.post();
    },
  };

export default services;
