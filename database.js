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
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao fazer login: " + error.message);
  } else {
    window.location.href = 'dashboard.html';
  }
}  


// ---------------------------------------------------------
// 2. FUNÇÃO DE CADASTRO (Totalmente fora e abaixo do Login)
// ---------------------------------------------------------
async function manipularCadastro() {
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve tener pelo menos 6 caracteres!");
    return;
  }

  console.log("Tentando cadastrar usuário:", email);

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao criar conta: " + error.message);
  } else {
    alert("Conta criada com sucesso! Você já pode entrar no sistema.");
    window.location.href = 'login.html';
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