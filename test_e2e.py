import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def rodar_teste_sistema():
    # 1. Inicializa o navegador Chrome de forma automatizada
    print("🤖 Iniciando o Selenium WebDriver...")
    servico = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=servico)
    driver.maximize_window()

    try:
        # ⚠️ ATENÇÃO: Substitua pela URL gerada pelo seu 'minikube service frontend-service --url'
        url_frontend = "http://127.0.0.1:64742" 
        
        # 2. Fluxo de Caixa Preta: Realizar o Login no Sistema
        print(f"🌐 Acessando o sistema em: {url_frontend}")
        driver.get(url_frontend)
        time.sleep(2) # Aguarda o carregamento visual

        print("✍️ Preenchendo credenciais de login...")
        campo_email = driver.find_element(By.ID, "email")
        campo_senha = driver.find_element(By.ID, "password")
        
        # Digita os dados no formulário
        campo_email.send_keys("breninfelipe@gmail.com")
        campo_senha.send_keys("senha_secreta_k8s_123")
        time.sleep(1)

        print("🖱️ Clicando no botão Entrar...")
        botao_entrar = driver.find_element(By.XPATH, "//button[@type='submit']")
        botao_entrar.click()
        time.sleep(3) # Aguarda a autenticação JWT e navegação

        # 3. Validação do Teste (Assert)
        print("🔍 Verificando se a Dashboard abriu com sucesso...")
        conteudo_pagina = driver.page_source
        
        if "Seus Chamados" in conteudo_pagina or "Olá" in conteudo_pagina:
            print("✅ TESTE APROVADO: Login realizado e Dashboard carregada com sucesso!")
        else:
            print("❌ TESTE FALHOU: Painel da Dashboard não foi encontrado.")

    except Exception as e:
        print(f"💥 Ocorreu um erro durante a execução do teste: {e}")
    
    finally:
        # 4. Encerra o navegador
        print("🚪 Fechando o navegador automatizado.")
        driver.quit()

if __name__ == "__main__":
    rodar_teste_sistema()