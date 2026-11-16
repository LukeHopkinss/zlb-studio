import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';

const policies = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How zlb studio collects, uses, and handles information shared through this website.',
    sections: [
      ['Who we are', 'zlb studio is a web design and development studio operated by Luke Hopkins. For privacy questions, contact luke.hopkins@outlook.com.'],
      ['Information we collect', 'When you contact us, we collect the name, email address, and message you provide. Please do not submit sensitive personal information. Our hosting and email providers may process technical information such as IP addresses, browser details, timestamps, and delivery logs to operate and protect their services.'],
      ['How we use information', 'We use your inquiry to respond, discuss potential projects, and manage our business communications. We use technical information to deliver and secure the website and limit abuse. We do not sell your contact information or use contact-form submissions for advertising.'],
      ['Service providers', 'Contact submissions are sent through Resend to our Outlook inbox, operated by Microsoft. These providers and our hosting providers process information to deliver their services and may process it in countries other than your own. We may also disclose information where required by law or necessary to protect legal rights.'],
      ['Storage and retention', 'This website uses session storage to remember whether you have dismissed the introductory screen during your browsing session. The site does not currently include advertising trackers or analytics scripts. Inquiry emails are retained as needed to respond, manage project relationships, and meet legal or business recordkeeping needs.'],
      ['Your choices', 'You may ask to access, correct, or delete information you have shared by emailing luke.hopkins@outlook.com. We will respond in accordance with applicable law, and may need to confirm your identity or retain records where legally required. You can clear session storage through your browser settings. Depending on where you live, you may have additional privacy rights, including the right to complain to your local data protection authority.'],
      ['Security and external links', 'We take reasonable steps to protect the information we handle, but no online service can guarantee absolute security. Portfolio links lead to independent websites with their own privacy practices.'],
      ['Children and updates', 'This website is intended for people seeking professional services and is not directed to children under 13. If a child has shared personal information, please contact us to request deletion. We may update this policy as our practices change and will post the revised date here.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms for using the zlb studio website and contacting the studio.',
    sections: [
      ['Using this website', 'These terms cover your use of the zlb studio website, operated by Luke Hopkins. By using this website, you agree to these terms. If you do not agree, please discontinue use. Questions can be sent to luke.hopkins@outlook.com.'],
      ['Project inquiries and agreements', 'Sending an inquiry does not create a client relationship or commit either party to a project. Scope, pricing, payment, deliverables, timelines, and intellectual property rights for paid services are established in a separate written agreement. That agreement governs those services.'],
      ['Portfolio and intellectual property', 'Website design, text, and original studio materials are owned by zlb studio or its licensors. Client names, logos, screenshots, and other portfolio materials belong to their respective owners and are displayed to describe our work. You may browse and link to this website; copying or reusing protected materials requires the relevant owner’s permission.'],
      ['Acceptable use', 'Do not misuse the contact form, send spam, submit unlawful content, impersonate others, interfere with the website, or attempt unauthorized access. You are responsible for the accuracy and lawfulness of information you submit.'],
      ['Portfolio results and external websites', 'Case studies describe project scope and design outcomes. Any figures explicitly labeled as illustrative are examples or targets, not verified client performance or guarantees. External websites may change after delivery and are controlled by their respective operators. We do not guarantee their content, availability, or services.'],
      ['Availability and limitations', 'We provide this informational website as available and do not guarantee uninterrupted access or error-free content. To the extent permitted by applicable law, zlb studio is not responsible for indirect or consequential losses arising from use of this website. Nothing in these terms limits rights or liabilities that cannot legally be excluded.'],
      ['Changes and contact', 'We may update the website and these terms. The updated date will appear on this page. For questions about these terms, contact luke.hopkins@outlook.com.'],
    ],
  },
};

export default function Legal({ kind }) {
  const policy = policies[kind];
  useDocumentMeta({ title: policy.title, description: policy.description, path: kind === 'privacy' ? '/privacy' : '/terms' });
  return (
    <main className="text-white px-6 pt-36 pb-20 sm:pt-44 lg:pt-52">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-neutral-400 underline">Back to work</Link>
        <h1 className="mt-8 text-4xl sm:text-5xl">{policy.title}</h1>
        <p className="mt-4 text-neutral-400">Last updated: November 16, 2026</p>
        {policy.sections.map(([title, body]) => (
          <section key={title} className="mt-9">
            <h2 className="text-xl mb-3">{title}</h2>
            <p className="text-neutral-300 leading-relaxed">{body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
