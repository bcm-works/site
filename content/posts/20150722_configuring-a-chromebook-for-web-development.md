---
title: Configuring a Chromebook for web development
date: 2015-07-22
url: /posts/20150722_configuring-a-chromebook-for-web-development/
oldUrl: /brendan/posts/20150722_configuring-a-chromebook-for-web-development/
tags:
  - Post
  - Development
  - Chrome
---

To fill the time commuting to work, I recently bought a [Chromebook](http://www.acer.co.uk/ac/en/GB/content/professional-series/chromebook11c730) which is basically a cheap laptop designed to use [Chrome Apps](https://chrome.google.com/webstore/category/apps) instead of traditional, installable desktop applications.

Chromebook devices run [Chrome OS](https://en.wikipedia.org/wiki/Chrome_OS) created by Google and based on the [Linux kernel](https://en.wikipedia.org/wiki/Linux_kernel). Access to the operating system and Linux shell is hidden by default but you can access it with a bit of effort to unlock it's full potential.

### Setup a local development environment

1. [Enable Developer Mode](http://www.howtogeek.com/210817/how-to-enable-developer-mode-on-your-chromebook/)
2. When the `OS verification is OFF` screen is shown, press `Ctrl + D` to dismiss the warning and boot Chrome OS
3. Login to your Google account
4. Press `Ctrl + Alt + T` to open a terminal window
5. Type `shell` and press `Enter` to enter the Linux shell
6. Install the [Chromebrew](http://skycocker.github.io/chromebrew/) package manager
7. To allow for SSH connections to other servers, install [Secure Shell](https://chrome.google.com/webstore/detail/secure-shell/pnhechapfaindjhompbnflcldabbghjo)
8. To access the Linux Shell from it's own window and be able to `Pin it to the Chrome OS shelf`, install [Crosh Window](https://chrome.google.com/webstore/detail/crosh-window/nhbmpbdladcchdhkemlojfjdknjadhmh)

After this process is completed, you'll have Git installed locally.

### Git and Vim configuration

Open the `Crosh Window` app and open the Linux Shell:

```bash
shell
```

Install [Vim](http://vim.wikia.com/wiki/Vim_Tips_Wiki) so you can edit files and Git commit messages via the Terminal:

```bash
crew install vim keep
```

Commands to set basic Git settings and set Vim as the default Git editor:

```bash
git config --global user.email "your.email@sample.com"
git config --global user.name "Your Name"
git config --global core.editor "vim"
```

Configure Vim to work with the Chromebook device by editing the `~/.vimrc` file to include:

```bash
set nocompatible
```

You might also want to [add more Vim settings](http://vim.wikia.com/wiki/Example_vimrc) to suit your needs. These will set the default settings for Vim when you edit files.

You're now ready to [git clone](http://git-scm.com/docs/git-clone) a code repository to a local folder, such as `~/Downloads/` or `/media/removable/SD Card/`.

### Improve productivity

To create a shortcut command called `cdgit` for getting to a Git folder on an SD card, add the following to the end of the `~/.bashrc` file:

```bash
# Change directory to the Git folder on the SD card
alias cdgit='cd /media/removable/SD\ Card/Git'
```

To avoid the annoying system beep on startup while in `Developer Mode`, just press `Ctrl + D` when the `OS verification is OFF` screen is shown.

If you'd prefer a more modern text editor, you can install one from the Web Store, such as [Caret](https://chrome.google.com/webstore/detail/caret/fljalecfjciodhpcledpamjachpmelml).

### Ready to go

You now have a cheap, portable device to develop your next web app on!
