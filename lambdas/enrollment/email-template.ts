import escapeHtml from 'escape-html';

interface SubjectProps {
  user: {
    name: string;
  };
}

export const subject = ({ user }: SubjectProps) => `Kod potwierdzający dla ${user.name}`;

interface BodyProps {
  user: {
    id: string;
    name: string;
  };
  facility: {
    id: string;
    name: string;
  };
  approvalToken: string;
  supportEmail: string;
}

export const body = (props: BodyProps) => {
  const { user, facility, approvalToken } = props;
  return `
  <div>
    <p>
      ${escapeHtml(user.name)} prosi o dołączenie jako pracownik w ${escapeHtml(facility.name)}.
      Przekaż mu kod potwierdzający podany niżej aby mógł sfinalizować proces dołączenia.
    </p>

    <h1>
      ${approvalToken}
    </h1>

    <p>
      Jeśli ${escapeHtml(user.name)} nie jest pracownikiem w ${escapeHtml(facility.name)} 
      ${reportLink('zgłoś to', props)} obsłudze serwisu.
    </p>
  </div>
  `;
};

const reportLink = (text: string, { user, facility, supportEmail }: BodyProps) =>
  `
  <a href="mailto:${supportEmail}
    ?subject=Zgłoszenie użytkownika podającego się za pracownika ośrodka
    &body=Użytkownik o identifykatorze ${user.id} podaje się za pracownika ośrodka ${facility.id}">${text}</a>
  `;
