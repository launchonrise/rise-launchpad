/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rise_launchpad.json`.
 */
export type RiseLaunchpad = {
  "address": "J2rhm79GS6JhCNCpmuxBHrVMSNU8fC8XLKQcMeAwqxyU",
  "metadata": {
    "name": "riseLaunchpad",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buy",
      "discriminator": [
        102,
        6,
        61,
        18,
        1,
        218,
        235,
        234
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "token_pool.mint",
                "account": "tokenPool"
              }
            ]
          }
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "walletBuyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                  95,
                  98,
                  117,
                  121,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "tokenPool"
              },
              {
                "kind": "account",
                "path": "buyer"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "minTokensOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createToken",
      "discriminator": [
        84,
        52,
        204,
        228,
        24,
        140,
        234,
        75
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "poolTokenAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createTokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "graduate",
      "discriminator": [
        45,
        235,
        225,
        181,
        17,
        218,
        64,
        130
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "token_pool.mint",
                "account": "tokenPool"
              }
            ]
          }
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initializeParams"
            }
          }
        }
      ]
    },
    {
      "name": "sell",
      "discriminator": [
        51,
        230,
        133,
        164,
        1,
        127,
        131,
        173
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "token_pool.mint",
                "account": "tokenPool"
              }
            ]
          }
        },
        {
          "name": "poolTokenAccount",
          "writable": true
        },
        {
          "name": "sellerTokenAccount",
          "writable": true
        },
        {
          "name": "walletSellRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116,
                  95,
                  98,
                  117,
                  121,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "tokenPool"
              },
              {
                "kind": "account",
                "path": "seller"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        },
        {
          "name": "minSolOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "platformConfig"
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "updateConfigParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "platformConfig",
      "discriminator": [
        160,
        78,
        128,
        0,
        248,
        83,
        230,
        160
      ]
    },
    {
      "name": "tokenPool",
      "discriminator": [
        103,
        51,
        150,
        210,
        226,
        131,
        104,
        33
      ]
    },
    {
      "name": "walletBuyRecord",
      "discriminator": [
        81,
        129,
        15,
        67,
        136,
        139,
        39,
        166
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "exceedsMaxWalletHold",
      "msg": "Purchase would exceed 5% max wallet hold"
    },
    {
      "code": 6001,
      "name": "exceedsDevWalletCap",
      "msg": "Purchase would exceed 5% dev wallet cap"
    },
    {
      "code": 6002,
      "name": "exceedsUnlockedSupply",
      "msg": "Exceeds available unlocked supply for current market cap"
    },
    {
      "code": 6003,
      "name": "zeroAmount",
      "msg": "Amount is zero"
    },
    {
      "code": 6004,
      "name": "slippageExceeded",
      "msg": "Slippage tolerance exceeded"
    },
    {
      "code": 6005,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6006,
      "name": "cooldownActive",
      "msg": "Buy cooldown active — too many buys in this block"
    },
    {
      "code": 6007,
      "name": "launchCooldownActive",
      "msg": "Launch cooldown active — max 1% per wallet for first 60 seconds"
    },
    {
      "code": 6008,
      "name": "alreadyGraduated",
      "msg": "Token has already graduated to DEX"
    },
    {
      "code": 6009,
      "name": "notReadyToGraduate",
      "msg": "Token has not reached graduation threshold"
    },
    {
      "code": 6010,
      "name": "poolPaused",
      "msg": "Token pool is paused"
    },
    {
      "code": 6011,
      "name": "insufficientDeployFee",
      "msg": "Insufficient deploy fee"
    },
    {
      "code": 6012,
      "name": "unauthorized",
      "msg": "Unauthorized — only admin can call this"
    },
    {
      "code": 6013,
      "name": "invalidFeeConfig",
      "msg": "Invalid fee configuration — fees cannot exceed 10%"
    },
    {
      "code": 6014,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6015,
      "name": "mathUnderflow",
      "msg": "Math underflow"
    }
  ],
  "types": [
    {
      "name": "createTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deployFee",
            "type": "u64"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "creatorFeeBps",
            "type": "u16"
          },
          {
            "name": "graduationFee",
            "type": "u64"
          },
          {
            "name": "graduationTargetSol",
            "type": "u64"
          },
          {
            "name": "maxWalletBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "platformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "deployFee",
            "type": "u64"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "creatorFeeBps",
            "type": "u16"
          },
          {
            "name": "graduationFee",
            "type": "u64"
          },
          {
            "name": "graduationTargetSol",
            "type": "u64"
          },
          {
            "name": "maxWalletBps",
            "type": "u16"
          },
          {
            "name": "creationPaused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "unlockedSupply",
            "type": "u64"
          },
          {
            "name": "tokensSold",
            "type": "u64"
          },
          {
            "name": "solRaised",
            "type": "u64"
          },
          {
            "name": "virtualSolReserves",
            "type": "u64"
          },
          {
            "name": "virtualTokenReserves",
            "type": "u64"
          },
          {
            "name": "realSolReserves",
            "type": "u64"
          },
          {
            "name": "realTokenReserves",
            "type": "u64"
          },
          {
            "name": "graduated",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "unlockTranche",
            "type": "u8"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "updateConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deployFee",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "platformFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "creatorFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "graduationFee",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "graduationTargetSol",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "maxWalletBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "creationPaused",
            "type": {
              "option": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "walletBuyRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "tokenPool",
            "type": "pubkey"
          },
          {
            "name": "tokensHeld",
            "type": "u64"
          },
          {
            "name": "lastBuySlot",
            "type": "u64"
          },
          {
            "name": "buysThisSlot",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
