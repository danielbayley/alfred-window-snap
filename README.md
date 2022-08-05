<img src="icon.svg" width="10%" align="right">

_[Alfred]_ Window Snap
======================
Manage windows with [Alfred], based on presets for any app using simple _[YAML]_ configuration.

[Workflows] require the paid _[Powerpack]_ upgrade.

Install
-------
easily with _[Homebrew]_[-alfred]:
~~~ sh
brew tap danielbayley/alfred
brew alfred install window-snap
# or
brew install --cask window-snap
~~~
or with [`brew bundle`] using a _[Brewfile]_:
~~~ rb
# Brewfile
tap "danielbayley/alfred"
cask "alfred-window-snap"
~~~

Contribute
----------
~~~ sh
brew tap danielbayley/pipeline
git config core.hooksPath .github/hooks
~~~

License
-------
[MIT] © [Daniel Bayley]

[MIT]:              LICENSE.md
[Daniel Bayley]:    https://github.com/danielbayley

[alfred]:           http://alfredapp.com
[powerpack]:        https://alfredapp.com/powerpack
[workflows]:        http://alfredapp.com/workflows

[homebrew]:         https://brew.sh
[-alfred]:          https://github.com/danielbayley/homebrew-alfred#readme
[`brew bundle`]:    https://docs.brew.sh/Manpage#bundle-subcommand
[brewfile]:         https://github.com/Homebrew/homebrew-bundle#usage

[yaml]:             https://yaml.org
