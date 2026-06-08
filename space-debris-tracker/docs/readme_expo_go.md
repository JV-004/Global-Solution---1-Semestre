## 📱 Expo Go — Cliente Mobile para Desenvolvimento

### O que é

O **Expo Go** é um aplicativo gratuito para Android e iOS que funciona como um ambiente
de execução para projetos React Native durante o desenvolvimento. Em vez de compilar e
instalar o app no celular a cada alteração — processo que pode levar vários minutos —
o Expo Go conecta diretamente ao projeto rodando no computador e exibe o app
instantaneamente no dispositivo físico, sem necessidade de emulador ou Android Studio.

---

### Vantagens

| Vantagem | Descrição |
|----------|-----------|
| **Zero configuração** | Não requer Android Studio, emulador ou cabo USB |
| **Instantâneo** | O app abre no celular em segundos via QR Code |
| **Hot Reload** | Toda alteração salva no código reflete automaticamente no celular em tempo real |
| **Dispositivo real** | Testa o app no hardware real — toque, gestos e desempenho reais |
| **Multiplataforma** | O mesmo QR Code funciona em Android e iOS simultaneamente |
| **Gratuito** | Disponível na Play Store e App Store sem custo |

No contexto do **Space Debris Tracker**, o Expo Go permite demonstrar o dashboard de debris,
os gráficos de risco e o chat com o agente RAG diretamente no celular para a gravação
do vídeo de entrega da Global Solution.

---

### Como utilizar

**Pré-requisito:** celular e computador na **mesma rede Wi-Fi**.

**1. Instalar o Expo Go no celular**

- Android: [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: App Store — buscar por "Expo Go"

**2. Iniciar o projeto no computador**

```powershell
# Windows — liberar execução de scripts PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Entrar na pasta do frontend e iniciar
cd space-debris-tracker/frontend
npm start
```

**3. Conectar o celular**

Após o `npm start`, um QR Code aparecerá no terminal:

- **Android:** abrir o app **Expo Go** → tocar em **"Scan QR Code"** → escanear o QR Code do terminal
- **iOS:** abrir o app de **Câmera** nativo → apontar para o QR Code → tocar na notificação que aparece

O app abrirá automaticamente no celular em poucos segundos.

**4. Durante o desenvolvimento**

| Ação | Comando no terminal |
|------|-------------------|
| Recarregar o app | Pressionar `r` |
| Abrir menu de developer | Pressionar `m` |
| Abrir no navegador | Pressionar `w` |
| Abrir no Android (emulador) | Pressionar `a` |
| Encerrar o servidor | `Ctrl + C` |

> ⚠️ **Atenção:** o arquivo `frontend/.env` deve conter o IP local do computador
> (não `localhost`), pois o celular acessa o backend pela rede:
> ```
> EXPO_PUBLIC_API_URL=http://192.168.X.X:8000
> ```
> Para descobrir o IP: `ipconfig` (Windows) ou `ifconfig` (Linux/Mac).
