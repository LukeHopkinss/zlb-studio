import { Link } from 'react-router-dom';

function ContactButton() {
  return (
    <Link to="/contact">
      <button className="text-3xl px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
        let's get in touch.
      </button>
    </Link>
  );
}

export default ContactButton;