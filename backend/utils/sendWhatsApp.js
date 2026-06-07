import axios from "axios";

export const sendWhatsApp = async (phone, message) => {
  try {
    await axios.post(
      "https://api.gupshup.io/sm/api/v1/msg",
      {
        channel: "whatsapp",
        source: "YOUR_GUPSHUP_NUMBER",
        destination: phone,
        message: {
          type: "text",
          text: message
        }
      },
      {
        headers: {
          apikey: "YOUR_GUPSHUP_API_KEY",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("WhatsApp sent");
  } catch (error) {
    console.log(error);
  }
};