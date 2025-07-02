# Stylus ERC20 Contract Errors and Fixes

## Issues Encountered

### 1. Binary Target Configuration Error
**Error**: The `Cargo.toml` file had a binary target configuration pointing to `src/erc20.rs`, but this file was being used as a module in the library. This caused errors like:
```
error[E0601]: `main` function not found in crate `stylus_erc20`
```

**Fix**: Removed the `[[bin]]` section from `Cargo.toml` since we only need a library target for a smart contract.

### 2. Missing `extern crate alloc` in Module
**Error**: The `erc20.rs` file was missing the `extern crate alloc` declaration, causing errors like:
```
error[E0432]: unresolved import `alloc`
error[E0433]: failed to resolve: use of unresolved module or unlinked crate `alloc`
```

**Fix**: Added `extern crate alloc` and `use alloc::string::String` to the `erc20.rs` file.

### 3. Deprecated Function Calls
**Warning**: The code was using deprecated functions from the Stylus SDK:
```
warning: use of deprecated function `stylus_sdk::msg::sender`: Use the .vm() method available on Stylus contracts instead
warning: use of deprecated function `stylus_sdk::evm::log`: Use the log method available under stylus_sdk::stylus_core::log
```

**Fix**: 
- Replaced all `msg::sender()` calls with `self.vm().msg_sender()`
- Replaced all `evm::log()` calls with `log(self.vm(), event)`
- Updated imports to use `stylus_sdk::stylus_core::log` instead of `evm::log`

### 4. Borrow Issues with VM Access
**Error**: When trying to access `self.vm()` multiple times in a method that already had mutable borrows of `self`, we encountered errors like:
```
error[E0502]: cannot borrow `*self` as immutable because it is also borrowed as mutable
```

**Fix**: In methods where we needed to call `self.vm()` multiple times, we stored the result in a local variable first to avoid multiple mutable borrows:
```rust
// Before
self.erc20.mint(self.vm().msg_sender(), value)?;

// After
let msg_sender = self.vm().msg_sender();
self.erc20.mint(msg_sender, value)?;
```

### 5. Incorrect Log Function Usage
**Error**: After updating to the new logging API, we encountered errors because the `log` function requires a VM reference:
```
error[E0061]: this function takes 2 arguments but 1 argument was supplied
```

**Fix**: Updated all log calls to include the VM reference:
```rust
// Before
log(Transfer { from, to, value });

// After
log(self.vm(), Transfer { from, to, value });
```

## Summary of Changes

1. **Cargo.toml**:
   - Removed the `[[bin]]` section to fix the binary target configuration issue

2. **erc20.rs**:
   - Added `extern crate alloc` and necessary imports
   - Updated deprecated function calls to use the newer API
   - Fixed borrow issues by storing VM references in local variables
   - Updated log function calls to include VM references

3. **lib.rs**:
   - Updated deprecated function calls to use the newer API
   - Fixed borrow issues by storing VM references in local variables
   - Simplified imports

These changes have successfully resolved all compilation errors, and the contract now builds correctly with the latest Stylus SDK.
