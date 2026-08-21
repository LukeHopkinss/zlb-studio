import { Link } from 'react-router-dom';

function ContactButton() {
  return (
    <Link to="/contact">
      <button className="text-lg sm:text-2xl lg:text-3xl px-5 sm:px-6 lg:px-8 py-2 sm:py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
        let's get in touch.
      </button>
    </Link>
  );
}

export default ContactButton;