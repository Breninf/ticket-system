import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def rodar_bateria_completa_e2e():
    print("🤖 Iniciando o Selenium WebDriver...")
    servico = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=servico)
    driver.maximize_window()

    # ⚠️ Ajustado automaticamente com base no seu log de execução real!
    url_frontend = "http://127.0.0.1:63818" 
    
    email_unico = f"breno_teste_{int(time.time())}@faculdade.com"
    senha_teste = "senha_secreta_k8s_123"

    try:
        # ====================================================================
        # 🧪 TESTE 1: CADASTRO DE USUÁRIO
        # ====================================================================
        print(f"🌐 Acessando a tela de login em: {url_frontend}")
        driver.get(url_frontend)
        time.sleep(2)

        print("🖱️ Clicando em 'Cadastre-se aqui'...")
        driver.find_element(By.LINK_TEXT, "Cadastre-se aqui").click()
        time.sleep(2)

        print(f"✍️ Preenchendo o cadastro com o e-mail: {email_unico}")
        driver.find_element(By.ID, "name").send_keys("Breno Silva")
        driver.find_element(By.ID, "email").send_keys(email_unico)
        driver.find_element(By.ID, "password").send_keys(senha_teste)
        time.sleep(1)

        print("🖱️ Enviando formulário de Cadastro...")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(2) # Aguarda o pop-up de sucesso nascer

        # 🚨 CORREÇÃO PRINCIPAL: Fecha o alerta de cadastro com sucesso!
        print("🔍 Capturando e fechando o alerta de cadastro...")
        alerta_cadastro = driver.switch_to.alert
        print(f"💬 Texto do alerta: {alerta_cadastro.text}")
        alerta_cadastro.accept()
        time.sleep(3) # Aguarda o redirecionamento visual para a tela de login

        # ====================================================================
        # 🧪 TESTE 2: LOGIN DO USUÁRIO CADASTRADO
        # ====================================================================
        print("✍️ Realizando login com a conta recém-criada...")
        driver.find_element(By.ID, "email").send_keys(email_unico)
        driver.find_element(By.ID, "password").send_keys(senha_teste)
        time.sleep(1)

        print("🖱️ Clicando no botão Entrar...")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(3) # Aguarda autenticação e montagem da Dashboard

        # ====================================================================
        # 🧪 TESTE 3: CRIAÇÃO DE TICKET / CHAMADO
        # ====================================================================
        print("🔍 Verificando se a Dashboard carregou...")
        if "Seus Chamados" in driver.page_source:
            print("✅ Sucesso: Tela de Dashboard detectada!")
            
            print("✍️ Preenchendo um novo chamado técnico...")
            inputs = driver.find_elements(By.TAG_NAME, "input")
            textarea = driver.find_element(By.TAG_NAME, "textarea")
            
            # Limpa e preenche o input de título
            inputs[0].clear()
            inputs[0].send_keys("Falha de Conexão no Microserviço")
            
            # Limpa e preenche o textarea de descrição
            textarea.clear()
            textarea.send_keys("O contêiner do Syslog-ng apresentou estouro de buffer de memória RAM.")
            time.sleep(1)

            print("🖱️ Clicando em Enviar Chamado...")
            driver.find_element(By.XPATH, "//button[@type='submit']").click()
            time.sleep(2) # Aguarda o alerta de sucesso do ticket
            
            # Fecha o pop-up de sucesso do chamado
            alerta_ticket = driver.switch_to.alert
            print(f"💬 Alerta do sistema capturado: {alerta_ticket.text}")
            alerta_ticket.accept()
            time.sleep(2)

            if "Falha de Conexão no Microserviço" in driver.page_source:
                print("🏆 BATERIA CONCLUÍDA COM SUCESSO: Cadastro, Login e Ticket validados de ponta a ponta!")
            else:
                print("❌ Falha: O ticket não apareceu listado na tela.")
        else:
            print("❌ Falha: O login não conseguiu nos levar até a Dashboard.")

    except Exception as erro:
        print(f"💥 Erro crítico detectado na automação: {erro}")
        
    finally:
        print("門 Fechando o navegador de testes.")
        driver.quit()

if __name__ == "__main__":
    rodar_bateria_completa_e2e()
