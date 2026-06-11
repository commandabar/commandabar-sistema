const SUPABASE_URL = 'https://zvfshfyombjogsuaasjq.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_QPxQtNvxslk4JFVFCuAVsg_PWam9cGD'; 

// Mudamos o nome da constante aqui para 'supabaseClient' para evitar o erro de duplicação:
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Arquivo database.js carregado e Supabase inicializado com sucesso!");

// ... (Aqui para cima fica a inicialização do supabase e outras coisas)

// ---------------------------------------------------------
// 1. FUNÇÃO DE LOGIN
// ---------------------------------------------------------
async function manipularLogin() {
  // Pegando os dados digitados na tela de login
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  console.log("Tentando autenticar:", email);

  // Fazendo o login oficial no Supabase
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao fazer login: " + error.message);
  } else {
    // Se deu certo, salva o token e joga para o Dashboard!
    window.location.href = 'dashboard.html';
  }
}

// ---------------------------------------------------------
// FUNÇÃO DE CADASTRO ATUALIZADA (COM CAPTURA DE PLANO)
// ---------------------------------------------------------
async function manipularCadastro() {
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // 1. Pega o plano que guardámos na memória (se não encontrar, assume 'free')
  const planoEscolhido = localStorage.getItem('plano_selecionado') || 'free';
  console.log("Criando conta para o plano:", planoEscolhido);

  // 2. Faz o cadastro oficial no Supabase Auth
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
    // Passamos o plano dentro de options.data para o Supabase guardar nos metadados do utilizador
    options: {
      data: {
        plano: planoEscolhido
      }
    }
  });

  if (error) {
    alert("Erro ao criar conta: " + error.message);
  } else {
    alert("Conta criada com sucesso!");

    // 3. SEPARAÇÃO DOS PLANOS (Passo 1 e Passo 2 que mapeaste)
    if (planoEscolhido === 'pro') {
      // Se for PRO, limpa a memória e manda para a tela de pagamento/checkout
      localStorage.removeItem('plano_selecionado');
      alert("A redirecionar para a página de pagamento do Plano Pro...");
      window.location.href = 'checkout.html'; // Podes criar esta página ou pôr o link do Stripe/Mercado Pago aqui
    } else {
      // Se for FREE, manda direto para o Dashboard
      localStorage.removeItem('plano_selecionado');
      window.location.href = 'dashboard.html';
    }
  }
}

// ---------------------------------------------------------
// 3. FUNÇÃO DE RECUPERAÇÃO DE SENHA
// ---------------------------------------------------------
async function recuperarSenha() {
  const email = prompt("Digite o e-mail cadastrado para redefinir sua senha:");

  if (!email) {
    return; // Se o usuário cancelar ou deixar em branco, não faz nada
  }

  // O Supabase envia um link de redefinição direto para o e-mail dele
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/dashboard.html', // Para onde ele vai após clicar no link do e-mail
  });

  if (error) {
    alert("Erro ao enviar e-mail de recuperação: " + error.message);
  } else {
    alert("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
  }
}