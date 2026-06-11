const SUPABASE_URL = 'https://zvfshfyombjogsuaasjq.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_QPxQtNvxslk4JFVFCuAVsg_PWam9cGD'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Arquivo database.js carregado e Supabase inicializado com sucesso!");

// =========================================================
// 1. FUNÇÃO DE LOGIN INTELIGENTE (DONO OU COLABORADOR)
// =========================================================
async function manipularLogin() {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  console.log("Tentando autenticar:", email);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao fazer login: " + error.message);
  } else {
    const user = data.user;
    
    // Captura metadados para saber o nível de acesso
    const role = user.user_metadata?.role || 'dono';
    const ownerId = user.user_metadata?.owner_id;

    // Vinculação e persistência do ID da base de dados do negócio
    if (role === 'funcionario' && ownerId) {
      localStorage.setItem('negocio_owner_id', ownerId);
      localStorage.setItem('user_role', 'funcionario');
    } else {
      localStorage.setItem('negocio_owner_id', user.id);
      localStorage.setItem('user_role', 'dono');
    }

    localStorage.setItem('usuarioLogado', 'true');
    window.location.href = 'dashboard.html';
  }
}

// =========================================================
// 2. FUNÇÃO DE CADASTRO ORIGINAL DO DONO
// =========================================================
async function manipularCadastro(event) {
  if(event) event.preventDefault();

  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;
  const planoEscolhido = localStorage.getItem('plano_selecionado') || 'free';

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
    options: {
      data: {
        plano: planoEscolhido,
        role: 'dono',
        owner_id: null
      }
    }
  });

  if (error) {
    alert("Erro ao criar conta: " + error.message);
  } else {
    alert("Conta criada com sucesso!");
    localStorage.removeItem('plano_selecionado');
    if (planoEscolhido === 'pro') {
      alert("A redirecionar para a página de pagamento...");
      window.location.href = 'checkout.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }
}

// =========================================================
// 3. RECUPERAÇÃO DE SENHA
// =========================================================
async function recuperarSenha() {
  const email = prompt("Digite o e-mail cadastrado para redefinir sua senha:");
  if (!email) return;

  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/dashboard.html',
  });

  if (error) {
    alert("Erro: " + error.message);
  } else {
    alert("E-mail de redefinição enviado!");
  }
}