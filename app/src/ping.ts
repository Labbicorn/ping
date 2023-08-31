export type Ping = {
  "version": "0.1.0",
  "name": "ping",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "pingName",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "ping",
      "accounts": [
        {
          "name": "pingName",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pingData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pingCounter",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: Ping = {
  "version": "0.1.0",
  "name": "ping",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "pingName",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "ping",
      "accounts": [
        {
          "name": "pingName",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pingData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pingCounter",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
