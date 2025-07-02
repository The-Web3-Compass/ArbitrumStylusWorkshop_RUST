// Only run this as a WASM if the export-abi feature is not set.
#![cfg_attr(not(any(feature = "export-abi", test)), no_main)]
extern crate alloc;

// Modules and imports
mod erc20;

use alloy_primitives::{Address, U256};
use stylus_sdk::prelude::*;
use crate::erc20::{Erc20, Erc20Params, Erc20Error};

/// Immutable definitions
struct CandyTokenParams;
impl Erc20Params for CandyTokenParams {
    const NAME: &'static str = "CandyToken";
    const SYMBOL: &'static str = "CANDY";
    const DECIMALS: u8 = 18;
}

// Define the entrypoint as a Solidity storage object. The sol_storage! macro
// will generate Rust-equivalent structs with all fields mapped to Solidity-equivalent
// storage slots and types.
sol_storage! {
    #[entrypoint]
    struct CandyToken {
        // Allows erc20 to access CandyToken's storage and make calls
        #[borrow]
        Erc20<CandyTokenParams> erc20;
    }
}

#[public]
#[inherit(Erc20<CandyTokenParams>)]
impl CandyToken {
    /// Mints tokens
    pub fn mint(&mut self, value: U256) -> Result<(), Erc20Error> {
        let msg_sender = self.vm().msg_sender();
        self.erc20.mint(msg_sender, value)?;
        Ok(())
    }

    /// Mints tokens to another address
    pub fn mint_to(&mut self, to: Address, value: U256) -> Result<(), Erc20Error> {
        self.erc20.mint(to, value)?;
        Ok(())
    }

    /// Burns tokens
    pub fn burn(&mut self, value: U256) -> Result<(), Erc20Error> {
        let msg_sender = self.vm().msg_sender();
        self.erc20.burn(msg_sender, value)?;
        Ok(())
    }
}