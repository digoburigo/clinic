import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { H3, H4, P, UL, LI } from "~/components/ui/typography";

export default function TermsOfService() {
  return (
    <div className="py-3 px-2 sm:px-10 sm:py-12 [&_p]:mb-6">
      <Card>
        <CardHeader>
          <H3>
            TERMOS DE SERVIÇO, POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS
            PESSOAIS
          </H3>
        </CardHeader>
        <CardContent>
          <H4>1. Introdução</H4>
          <P>
            Esta Política de Privacidade tem como objetivo informar aos
            pacientes, colaboradores e parceiros sobre como os dados pessoais
            são coletados, utilizados, armazenados e protegidos pela [Nome da
            Clínica], conforme a Lei Geral de Proteção de Dados Pessoais (LGPD -
            Lei nº 13.709/2018). A MClinic tem o compromisso de garantir a
            privacidade e a segurança dos dados pessoais que estão sob sua
            responsabilidade.
          </P>

          <H4>2. Definições</H4>
          <P>Para os fins desta Política, consideram-se os seguintes termos:</P>
          <UL>
            <LI>
              <strong>Dado pessoal:</strong> Qualquer informação relacionada a
              uma pessoa natural identificada ou identificável.
            </LI>
            <LI>
              <strong>Tratamento de dados:</strong> Toda operação realizada com
              dados pessoais, como coleta, armazenamento, utilização, etc.
            </LI>
            <LI>
              <strong>Titular dos dados:</strong> Pessoa natural a quem os dados
              se referem.
            </LI>
          </UL>

          <H4>3. Dados Coletados</H4>
          <P>A MClinic pode coletar os seguintes dados pessoais:</P>
          <UL>
            <LI>
              <strong>Dados de identificação:</strong> Nome, CPF, RG, endereço,
              telefone, e-mail.
            </LI>
            <LI>
              <strong>Dados de saúde:</strong> Histórico médico, condições de
              saúde, tratamentos realizados, exames, entre outros.
            </LI>
            <LI>
              <strong>Dados financeiros:</strong> Informações de pagamento,
              convênios, planos de saúde, etc.
            </LI>
            <LI>
              <strong>Dados sensíveis:</strong> Dados relacionados à saúde e à
              vida sexual (quando aplicável).
            </LI>
          </UL>

          <H4>4. Finalidade da Coleta de Dados</H4>
          <P>Os dados coletados pela MClinic têm as seguintes finalidades:</P>
          <UL>
            <LI>Realização de atendimentos médicos e procedimentos.</LI>
            <LI>Agendamento de consultas e exames.</LI>
            <LI>Envio de informações e comunicações sobre a clínica.</LI>
            <LI>Cumprimento de obrigações legais e regulamentares.</LI>
            <LI>Faturamento, cobrança e registro de pagamentos.</LI>
          </UL>

          <H4>5. Compartilhamento de Dados</H4>
          <P>Os dados pessoais poderão ser compartilhados com:</P>
          <UL>
            <LI>
              Profissionais de saúde: Para garantir a continuidade do
              atendimento e tratamento.
            </LI>
            <LI>
              Convênios e planos de saúde: Para a autorização de procedimentos e
              cobertura de custos.
            </LI>
            <LI>
              Autoridades competentes: Quando necessário para o cumprimento de
              obrigações legais ou regulatórias.
            </LI>
          </UL>

          <H4>6. Armazenamento e Segurança dos Dados</H4>
          <P>
            A MClinic adota medidas técnicas e administrativas para proteger os
            dados pessoais contra acessos não autorizados, vazamentos,
            alterações ou destruições. Os dados são armazenados de forma segura,
            respeitando os princípios de confidencialidade e integridade.
          </P>

          <H4>7. Direitos dos Titulares dos Dados</H4>
          <P>Os titulares dos dados pessoais têm os seguintes direitos:</P>
          <UL>
            <LI>
              Acesso: Solicitar confirmação da existência de tratamento e acesso
              aos dados pessoais.
            </LI>
            <LI>
              Correção: Solicitar correção de dados incompletos, inexatos ou
              desatualizados.
            </LI>
            <LI>
              Exclusão: Solicitar a exclusão de dados pessoais, quando
              aplicável.
            </LI>
            <LI>
              Portabilidade: Solicitar a transferência dos dados para outro
              serviço ou produto.
            </LI>
            <LI>
              Revogação do consentimento: Solicitar a revogação do consentimento
              dado para o tratamento dos dados pessoais, quando aplicável.
            </LI>
          </UL>

          <H4>8. Consentimento</H4>
          <P>
            A MClinic solicita o consentimento explícito do paciente para o
            tratamento de seus dados pessoais, sendo este consentimento
            fornecido no momento do cadastro e do início do atendimento.
          </P>

          <H4>9. Alterações nesta Política de Privacidade</H4>
          <P>
            A MClinic se reserva o direito de alterar esta Política de
            Privacidade a qualquer momento, com a devida comunicação aos
            pacientes, conforme necessário.
          </P>

          <H4>10. Contato</H4>
          <P>
            Em caso de dúvidas, solicitações ou reclamações sobre o tratamento
            de dados pessoais, entre em contato com a nossa equipe de
            privacidade através do e-mail:{" "}
            <a href="mailto:contato@mclinia.com" className="text-primary underline">
              contato@mclinic.com
            </a>
          </P>
        </CardContent>
      </Card>
    </div>
  );
}
