# case insensitive text comparisons for user input
shopt -s nocasematch
shopt -s extglob

read -p "First we will try to delete any exising fakezod at ~/dev/urbit/ships/zod. Press Enter key to continue or type N/NO to skip.. " user_input
if [[ $user_input != "n" && $user_input != "no" ]] ; then
	rm -r ~/dev/urbit/ships/zod
	read -p "Now you need to create a new fake zod at the location. Run 'urbit -F zod -c ~/dev/urbit/ships/zod/' in another terminal session. Press any key once the ship is fully booted......"
fi

# navigate to the urbit bouncer repo
cd ~/urbit/bouncer
bin/bounce -c ~/dev/urbit/holium/campfire/campfire/helpers/glob-config.yml

# at this point glob should be built and ready to go
echo "Your glob can be found at '~/dev/urbit/ships/zod/.urb/put/'"
