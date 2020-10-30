#!/bin/bash


function help()
{
   echo ""
   echo "Usage: $0 -p pathParameter -s scriptParameter"
   echo -e "\t-p A path to the local project directory"
   echo -e "\t-s The name of the script you want to run"
   exit 1 # Exit script after printing help
}

while getopts "p:s:" opt
do
   case "$opt" in
      p ) pathParameter="$OPTARG" ;;
      s ) scriptParameter="$OPTARG" ;;
      ? ) help ;; # Print help in case parameter is non-existent
   esac
done

# Print help in case parameters are empty
if [ -z "$pathParameter" ] || [ -z "$scriptParameter" ]
then
   echo "Some or all of the parameters are empty";
   help
fi

# Begin script in case all parameters are correct
echo "$pathParameter"
echo "$scriptParameter"

cd $pathParameter
yarn $scriptParameter
