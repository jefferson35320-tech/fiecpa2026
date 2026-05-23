import time
import requests
import RPi.GPIO as GPIO
import Adafruit_ADS1x15

# Configuração do modo dos pinos do Raspberry Pi (Numeração BCM)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Inicializa o conversor ADC (ADS1115 ou ADS1116)
adc = Adafruit_ADS1x15.ADS1115()
GAIN = 1  

# URLs da API
GET_URL = "https://wr09fdpz61.execute-api.us-east-2.amazonaws.com/devices/"
PUT_URL_TEMPLATE = "https://wr09fdpz61.execute-api.us-east-2.amazonaws.com/devices/{id}"

# Dicionário para guardar a configuração atual de cada pino
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

def atualizar_e_ler_porta(porta, tipo, valor_recebido):
    """Aplica o valor recebido (se for LED) ou lê o ADC (se for SENSOR)."""
    if tipo == 'led':
        # Garante que o valor seja 0 (LOW) ou 1 (HIGH)
        estado_led = GPIO.HIGH if int(valor_recebido) >= 1 else GPIO.LOW
        GPIO.output(porta, estado_led)
        print(f"[GPIO] LED na porta {porta} definido para: {valor_recebido}")
        return int(valor_recebido)
        
    elif tipo == 'sensor':
        # Mapeia a porta GPIO para o canal do ADC (0 a 3)
        canal_adc = porta % 4
        try:
            # Lê o valor analógico atual do sensor
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
            # 1. Faz o GET para buscar as configurações e valores dos dispositivos
            response = requests.get(GET_URL)
            
            if response.status_code == 200:
                dados = response.json()
                dispositivos = dados.get('dispositivos', [])
                
                for dev in dispositivos:
                    device_id = dev.get('id')
                    tipo = dev.get('tipo', '').lower()
                    porta = int(dev.get('porta'))
                    valor_api = dev.get('valor', 0) # Pega o campo 'valor' vindo da API (padrão 0 se não existir)
                    
                    # 2. Configura a GPIO dinamicamente (INPUT ou OUTPUT)
                    configurar_gpio(porta, tipo)
                    
                    # 3. Se for LED, aciona a porta com o valor do GET. Se for SENSOR, lê o ADC.
                    valor_final = atualizar_e_ler_porta(porta, tipo, valor_api)
                    
                    # 4. Envia o estado de volta para a API (PUT)
                    enviar_estado(device_id, tipo, porta, valor_final)
                    
            else:
                print(f"[GET] Falha ao buscar dispositivos. Status: {response.status_code}")
                
        except Exception as e:
            print(f"[ERRO] Falha na comunicação: {e}")
            
        # Aguarda 2 segundos antes da próxima iteração
        time.sleep(2)

except KeyboardInterrupt:
    print("\nEncerrando o programa de forma segura...")
finally:
    GPIO.cleanup()
    print("GPIO limpo com sucesso.")