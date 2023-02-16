#!/bin/bash -xv
#. /usr/local/nvm/nvm.sh
. /var/lib/jenkins/.bash_profile

ENVIRONMENT=$1
NVM_VERSION=v14.21.1
echo "Switching NODE to v14.21.1"
nvm use $NVM_VERSION
NODE_VERSION=`node --version`

case ${ENVIRONMENT} in

WorkflowsBots)
        ENV="workflows"
        ;;
findly-dev)
        ENV="clouddev"
        ;;

findly-pilot)
        ENV="pilot"
        ;;

findly-prod)
        ENV="prod"
        ;;
findly-qa)
        ENV="qa"
        ;;

findly-app)
        ENV="app"
        ;;

qabots)
        ENV="qa"
        ;;

qa1bots)
        ENV="qa1"
        ;;

bots)
        ENV="devbots"
        ;;

PerfBots)
        ENV="perf"
        ;;
ProdBots)
        ENV="prod"
        ;;
staging-korebots)
        ENV="pilot"
        ;;
OnPrem)
        ENV="onprem"
        ;;
staging-korebots)
        ENV="pilot"
        ;;
Kora)
        ENV="perf"
        ;;
loadtest-env)
        ENV="onprem"
        ;;
ssl-loadtest-env)
        ENV="onprem"
        ;;
LOADTEST)
         ENV="onprem"
        ;;
PilotBots)
        ENV="pilot"
        ;;
pilot-env)
        ENV="pilot"
        ;;
KoreappsBots)
        ENV="botsint"
        ;;
SegBots)
        ENV="prod"
        ;;
SegBots-EU)
        ENV="prod"
        ;;
SegBots-AZ)
        ENV="onprem"
        ;;

UATBOT)
        ENV="uat"
        ;;
solutions)
        ENV="onprem"
        ;;
ProdKoraMsg)
        ENV="production"
        ;;
*)
        echo "Invalid Environment Selected"
esac

echo "$ENV"

if [ "$NODE_VERSION" == "$NVM_VERSION" ];  then

        echo "Starting the NODE BUILD to the $ENVIRONMENT"

        export NODE_OPTIONS="--max-old-space-size=4096"
        npm i --force
        npm run build -- --c=$ENV

           if [ $? = 0 ]; then

                        echo "The NPM build is sucess on $ENVIRONMENT"
                else
                        echo "Please Check the Build LOG for errors"
                        exit 1
            fi


     else

        echo "Please Check the NVM VERSION. The NVM version is not pointed to the $NODE_VERSION"
        exit 1
fi
