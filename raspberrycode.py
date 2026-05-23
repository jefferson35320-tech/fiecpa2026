import time
import requests
import RPi.GPIO as GPIO
import Adafruit_ADS1x15

# Configuração do modo dos pinos do Raspberry Pi (Numeração BCM)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Inicializa o conversor ADC (ADS1115 ou ADS1116)
# Por padrão, assume o endereço I2C 0x48
adc = Adafruit_ADS1x15.ADS1115()
GAIN = 1  # Ganho de +/-4.096V (pode ser ajustado conforme a sua necessidade)

# URLs da API
GET_URL = "https://wr09fdpz61.execute-api.us-east-2.amazonaws.com/devices/"
PUT_URL_TEMPLATE = "https://wr09fdpz61.execute-api.us-east-2.amazonaws.com/{id}"

# Dicionário para guardar a configuração atual de cada pino e evitar reconfigurações redundantes
pin_configurations = {}

def configurar_gpio(porta, tipo):
    """Configura o pino GPIO dinamicamente caso o tipo mude."""
    if porta not in pin_configurations or pin_configurations[porta] != tipo:
        if tipo == 'led':
            GPIO.setup(porta, GPIO.OUT)
            print(f"[GPIO] Porta {porta} configurada como OUTPUT (LED)")
        elif tipo == 'sensor':
            GPIO.setup(porta, GPIO.IN)
            print(f"[GPIO] Porta {porta} configurada como INPUT (SENSOR)")
        pin_configurations[porta] = tipo

def ler_valor_porta(porta, tipo):
    """Lê o valor físico baseado no tipo de dispositivo."""
    if tipo == 'led':
        # Retorna o estado atual da saída (0 ou 1)
        return GPIO.input(porta)
    elif tipo == 'sensor':
        # Como a especificação pede leitura vinda do ADC, mapeamos a porta do GPIO para o canal do ADC.
        # Exemplo: Porta GPIO X lê o canal (porta % 4) do ADC (canais de 0 a 3)
        canal_adc = porta % 4
        try:
            # Lê o valor analógico bruto do canal correspondente
            valor_analogico = adc.read_adc(canal_adc, gain=GAIN)
            return valor_analogico
        except Exception as e:
            print(f"[ADC] Erro ao ler o canal {canal_adc}: {e}")
            return 0
    return 0

def enviar_estado(id_device, tipo, porta, valor):
    """Envia o estado atual do dispositivo via rota PUT."""
    url = PUT_URL_TEMPLATE.format(id=id_device)
    payload = {
        "tipo": tipo,
        "porta": porta,
        "valor": valor
    }
    try:
        response = requests.put(url, json=payload)
        if response.status_code == 200:
            print(f"[PUT] Sucesso ao atualizar ID {id_device}: {payload}")
        else:
            print(f"[PUT] Falha ao atualizar ID {id_device}. Status: {response.status_code}")
    except Exception as e:
        print(f"[PUT] Erro na requisição PUT para ID {id_device}: {e}")

# Loop Principal (Executa a cada 2 segundos)
try:
    print("Iniciando monitoramento de dispositivos...")
    while True:
        try:
            # 1. Faz o GET para buscar as configurações dos dispositivos
            response = requests.get(GET_URL)
            
            if response.status_code == 200:
                dados = response.json()
                
                # Supondo que a API retorna uma lista sob a chave 'dispositivos' (conforme seu código anterior)
                dispositivos = dados.get('dispositivos', [])
                
                # Se a API retornar uma lista direta no body, use: dispositivos = dados
                for dev in dispositivos:
                    device_id = dev.get('id')
                    tipo = dev.get('tipo').lower() # Garante tratamento em caixa baixa ('led' ou 'sensor')
                    porta = int(dev.get('porta'))
                    
                    # 2. Configura a GPIO dinamicamente
                    configurar_gpio(porta, tipo)
                    
                    # 3. Lê o valor atual do pino (Digital ou Analógico via ADC)
                    valor_atual = ler_valor_porta(porta, tipo)
                    
                    # 4. Envia o estado de volta para a API (PUT)
                    enviar_estado(device_id, tipo, porta, valor_atual)
                    
            else:
                print(f"[GET] Falha ao buscar dispositivos. Status: {response.status_code}")
                
        except Exception as e:
            print(f"[ERRO] Falha na comunicação: {e}")
            
        # Aguarda 2 segundos antes da próxima iteração
        time.sleep(2)

except KeyboardInterrupt:
    print("\nEncerrando o programa de forma segura...")
finally:
    GPIO.cleanup() # Limpa as configurações de GPIO ao sair do programa
    print("GPIO limpo com sucesso.")