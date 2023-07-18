import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="p-5 sm:p-10">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <div className="my-4">Effective Date: July 17, 2023</div>
      <p className="mb-4">
        Welcome to Connect! These Terms of Service (&#34;Terms&#34;) are a legal
        agreement between you and Connect (collectively, &#34;us&#34; or
        &#34;we&#34;) governing your use of the Connect website and any
        associated mobile applications (collectively, the &#34;Service&#34;).
        Please read these Terms carefully before using the Service. By accessing
        or using the Service, you affirm that you have read, understand, and
        agree to be bound by these Terms. If you do not agree to these Terms,
        you may not access or use the Service.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Use of the Service</h2>
      <p className="mb-4">
        The Service allows users to create accounts, post content, send replies,
        upload profile images, and create usernames. Only individuals aged 18
        and older may create accounts or use the Service.
      </p>
      <p className="mb-4">
        To use certain features of the Service, you may be required to provide
        certain personal information like your name, email address, and date of
        birth to create an account. You represent and warrant that all
        information you provide to us is accurate, current, and complete.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Prohibited Conduct</h2>
      <h4>You agree not to use the Service to:</h4>
      <ul className="list-disc list-inside">
        <li>
          Post illegal, offensive, obscene, abusive, threatening, harassing, or
          otherwise objectionable content.
        </li>
        <li>Impersonate any person or entity.</li>
        <li>Stalk, intimidate, or harass others.</li>
        <li>Distribute spam, chain letters, or viruses.</li>
        <li>Infringe upon the intellectual property rights of others.</li>
        <li>
          Post any private or personal information of a third party without
          their consent.
        </li>
      </ul>
      <h2 className="mt-6 mb-2 text-xl font-semibold">User Content</h2>
      <p className="mb-4">
        &#34;User Content&#34; means any content uploaded, posted, or
        transmitted by you to the Service. You retain ownership of your User
        Content. However, by uploading, posting, or transmitting User Content to
        the Service, you grant us a worldwide, perpetual, irrevocable,
        non-exclusive, royalty-free license to use, copy, modify, distribute,
        publish, transmit, and display your User Content in connection with
        operating and providing the Service.
      </p>
      <p className="mb-4">
        We have the right (but not the obligation) to monitor User Content to
        determine compliance with these Terms and any operating rules
        established by us and to satisfy any law, regulation, or governmental
        request. We reserve the right to remove or disable any User Content at
        any time without notice to you.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Accounts and Privacy</h2>
      <p className="mb-4">
        You are responsible for safeguarding the password for your account. You
        agree not to disclose your password to any third party and to
        immediately notify us if your password is lost, stolen, or compromised.
      </p>
      <p className="mb-4">
        We respect your privacy. Our{" "}
        <Link
          href="/policy/privacy"
          className="text-emerald-200 hover:text-emerald-500"
        >
          Privacy Policy
        </Link>{" "}
        further explains how we collect, use, and disclose information about
        you.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">
        Disclaimers and Limitation of Liability
      </h2>
      <p className="mb-4">
        THE SERVICE AND ALL CONTENT IS PROVIDED ON AN &#34;AS IS&#34; AND
        &#34;AS AVAILABLE&#34; BASIS. WE DISCLAIM ALL REPRESENTATIONS AND
        WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY.
      </p>
      <p className="mb-4">
        WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL,
        EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO THE USE OF THE
        SERVICE. OUR MAXIMUM LIABILITY FOR ALL DAMAGES RELATED TO THE SERVICE IS
        LIMITED TO THE GREATER OF £100 OR THE AMOUNT YOU PAID US IN THE PAST
        TWELVE MONTHS.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">
        Applicable Law and Jurisdiction
      </h2>
      <p className="mb-4">
        These Terms are governed by the laws of England and Wales. All disputes
        related to these Terms or the Services will be subject to the exclusive
        jurisdiction of the courts located in England.
      </p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">
        Changes to these Terms
      </h2>
      We may revise these Terms at any time. By continuing to use the Service
      after the effective date of any changes, you agree to the revised Terms.
      <h2 className="mt-6 mb-2 text-xl font-semibold">Contact Us</h2>
      <p className="mb-4">
        Please contact us at sean.stocker15@gmail.com or 07517273075 with any
        questions about these Terms.
      </p>
    </div>
  );
}
