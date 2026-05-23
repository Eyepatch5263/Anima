# Cloud GPU Droplet Generation & Local Recovery Guide

This guide describes how to run the anime narrative intelligence generator on a DigitalOcean GPU droplet (e.g. RTX 4000 Ada), secure internal ports, route requests via Nginx, and copy the populated databases back to your local environment.

---

## 1. Droplet Setup (DigitalOcean)

1. Create a **GPU Droplet** with the **RTX 4000 Ada** using the **Docker** marketplace image (or Ubuntu 22.04 LTS).
2. Configure **NVIDIA Container Toolkit** on the Droplet so Docker containers can access the GPU:
   ```bash
   # Add NVIDIA package repositories
   curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
   curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
     sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
     sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
     
   sudo apt-get update
   sudo apt-get install -y nvidia-container-toolkit
   
   # Restart Docker service
   sudo systemctl restart docker
   ```

---

## 2. Deploy Files to Droplet

Upload the following files to a folder on your droplet (e.g., `~/cloud-setup/`):
* `docker-compose.yml`
* `nginx.conf`
* `import_and_generate.py`
* `run_pipeline.sh`
* `1960-2026.csv` (Copy this from your local workspace)

You can use SCP to upload them from your local computer:
```bash
scp -r ./cloud-setup user@your-droplet-ip:~/
```

---

## 3. Run Pipeline on Droplet

SSH into the droplet and run the orchestration script:
```bash
cd ~/cloud-setup
chmod +x run_pipeline.sh

# Run script in a screen/tmux session so it runs continuously in background
# You can customize MODEL_NAME (default: qwen2.5:7b) via env variables
export MODEL_NAME="qwen2.5:7b"
tmux new -s narrative_gen
./run_pipeline.sh
```

*(To detach from the tmux session press `Ctrl + B` then `D`. To resume and check logs, run `tmux attach -t narrative_gen`)*

---

## 4. Secure Gateway Architecture & Nginx Config

To prevent unauthorized access to backend containers, all individual container ports are bound to the loopback interface (`127.0.0.1`), meaning they are not exposed to the public internet.

The configuration exposes **only port 80** through an **Nginx** reverse proxy:
* **Qdrant API Route**: `http://<droplet-ip>/qdrant/` (proxies to container port `6333`)
* **Ollama API Route**: `http://<droplet-ip>/ollama/` (proxies to container port `11434`)
* **PostgreSQL (Database)**: Bound to `127.0.0.1:5432` and remains fully private. If remote access is needed, use SSH port forwarding (`ssh -L 5432:127.0.0.1:5432 user@your-droplet-ip`).

To check the gateway health, navigate to `http://<droplet-ip>/health` or run:
```bash
curl http://<droplet-ip>/health
```

---

## 5. Package and Download Populated Databases

Once processing finishes on the cloud:

1. Stop the docker containers on the droplet:
   ```bash
   docker compose down
   ```
2. Archive the Postgres and Qdrant data volumes (run as root):
   ```bash
   sudo tar -czf db_volumes.tar.gz \
     /var/lib/docker/volumes/cloud-setup_postgres_data/_data \
     /var/lib/docker/volumes/cloud-setup_qdrant_data/_data
   ```
3. Download the archive back to your local computer:
   ```bash
   scp user@your-droplet-ip:~/cloud-setup/db_volumes.tar.gz ./
   ```

---

## 6. Load Volumes Locally

1. On your local machine, stop any running local Postgres/Qdrant containers.
2. Extract the downloaded archive directly into your local docker volume directories or local mapping folders:
   ```bash
   tar -xzf db_volumes.tar.gz
   ```
3. Copy the extracted directories to replace your local Docker volumes (located at `/var/lib/docker/volumes/your-local-project-name_...`).
4. Restart your local NextJS backend and databases. They will instantly load the 14k+ fully processed anime and narrative vector embeddings without local GPU load!
