import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Create an SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const allowed_emails = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[eE][dD][uU]$/;
export const allowed_arxiv_links = /^https?:\/\/((?:www\.)?arxiv\.org\/abs\/\d{1,}\.\d{1,}|(?:www\.)?(?:bio|med)rxiv\.org\/(?:content|c)\/10\.1101\/\d{4}\.\d{2}\.\d{2}\.?\d*)/;

export function isPayloadValid({ fields = [], payload }) {
  for (var i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (payload[field]) {
      if (payload[field] !== "" || payload[field] !== null) {
        return true;
      } else {
        return `${field} is empty`;
      }
    } else {
      return `${field} is missing`;
    }
  }
}

export let getRequestFilters = (context) => {
  if (!context) return "";

  let { name, id } = context ?? {};
  if (!name?.match(/(recent|topic)/)) return "";

  return `?${
    name === "topic" ? `topic_id=${id}` : name === "recent" && `q=recent`
  }`;
};

export function capitalize(val) {
  return `${val?.slice(0, 1)}${val?.slice(1, val.length).toLowerCase()}`;
}

export function trimming(val, size = 54) {
  let capitalized = capitalize(val);

  return capitalized.length > size
    ? `${capitalized?.slice(0, size)}...`
    : capitalized;
}

export function random() {
  return (Math.random() + 100).toString(36).substring(1);
}

export let getExpiry = (hours) => {
  let now = new Date();
  return new Date(now.setHours(now.getHours() + hours));
};

export function Notify({ status = "", content = "..." }) {
  let config = {
    position: "bottom-right",
  };

  status ? toast[status](content, config) : toast(content, config);
}

export const generateTempPassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmail = async (to, subject, text) => {
  const params = {
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: text,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log(`Email sent successfully to ${to}. MessageId: ${response.MessageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export function escapeSearchString(str) {
  if (!str) return '';

  // Split the string into words, preserving quoted phrases
  const words = str.match(/\w+|"[^"]+"/g) || [];

  // Process each word or phrase
  const processedWords = words.map(word => {
    word = word.replace(/^"|"$/g, '');
    
    word = word.replace(/[&|!():/\\]/g, '\\$&');
    
    if (word.includes(' ')) {
      word = `"${word}"`;
    }
    
    return word;
  });

  // Join words with ' & ' for an AND search
  return processedWords.join(' & ');
}

