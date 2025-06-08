  while IFS='=' read -r key value; do
    if [[ $key =~ ^[[:space:]]*# ]] || [[ -z $key ]]; then
      continue
    fi

    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
    echo "$value" | bun run wrangler secret put "$key"
  done < .dev.vars