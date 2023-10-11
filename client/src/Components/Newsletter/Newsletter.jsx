import { useState } from "react";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logica de subscripción
    setSubscribed(true);
  };
  return (
    <div className="max-w-none bg-blue-900 h-[300px] container w-full text-white text-center md:text-left mb-0 md:mb-0 flex flex-col items-center justify-center">
      {subscribed ? (
        <p
          className="text-lg md:text-xl"
          style={{ fontFamily: "Rubik, sans-serif" }}>
          {`Thank you for subscribing! You'll receive our best offers soon.`}
        </p>
      ) : (
        <div className="flex flex-col justify-center items-center text-center">
          <p
            className="text-lg md:text-xl"
            style={{ fontFamily: "Rubik, sans-serif" }}>
            {t("LANDING PAGE.NEWSLETTER.DESCRIPTION 1")}
          </p>
          <p className="text-sm">
            {t("LANDING PAGE.NEWSLETTER.DESCRIPTION 2")}
          </p>
        </div>
      )}
      <form className="flex flex-col md:flex-row" onSubmit={handleSubmit}>
        {subscribed ? (
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md cursor-not-allowed"
            style={{ fontFamily: "Rubik, sans-serif" }}
            type="button"
            disabled>
            Subscribed
          </button>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <input
              type="email"
              name="email"
              placeholder={t("LANDING PAGE.NEWSLETTER.PLACEHOLDER")}
              value={email}
              onChange={handleEmailChange}
              className="bg-white w-[600px] text-gray-800 rounded-md py-2 px-3 mb-2 md:mr-2 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              type="submit"
              style={{ fontFamily: "Rubik, sans-serif" }}>
              {t("LANDING PAGE.NEWSLETTER.BUTTON")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Newsletter;

//https://www.youtube.com/watch?v=bHN65tbYqBw
