// src/chatbot/Options.jsx
const Options = ({ actionProvider }) => {
    const options = [
      "Skin Issue",
      "Blood Report",
      "Home Remedy",
      "Vet Hospital",
      "Pet Shop",
    ];
  
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => actionProvider.handleOption(option)}
            className="bg-rose-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-rose-600 transition"
          >
            {option}
          </button>
        ))}
      </div>
    );
  };
  
  export default Options;
  